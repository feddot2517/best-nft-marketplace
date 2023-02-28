// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract NFTMarketplace {
    uint8 public OWNER_ROYALTY;
    uint8 public AUTHOR_ROYALTY;

    address public OWNER;
    address public AUTHOR;

    uint256 public offerCount;
    mapping (uint256 => _Offer) public offers;
    mapping (uint8 => IERC20) public currencies;
    IERC721 public nftCollection;

    using SafeMath for uint256;

    struct _Offer {
        uint256 offerId;
        uint256 tokenId;
        address user;
        uint256 price;
        uint8 currencyId;
        bool fulfilled;
        bool cancelled;
    }

    event OfferCreated(
        uint256 offerId,
        uint256 tokenId,
        address user,
        uint256 price,
        uint8 currencyId,
        bool fulfilled,
        bool cancelled
    );

    event OfferFilled(uint256 offerId, uint256 tokenId, address newOwner);
    event OfferCancelled(uint256 offerId, uint256 tokenId, address owner);
    event ClaimFunds(address user, uint256 amount);

    constructor(
        address _nftCollection,
        address[] memory _currencies,
        address _author,
        uint8 _authorRoyalty,
        uint8 _ownerRoyalty
    ) {

        for(uint8 i = 0; i < _currencies.length; i++) {
            currencies[i] = IERC20(_currencies[i]);
        }
        OWNER = msg.sender;
        OWNER_ROYALTY = _ownerRoyalty;
        AUTHOR = _author;
        AUTHOR_ROYALTY = _authorRoyalty; // 200
        nftCollection = IERC721(_nftCollection);
    }

    function makeOffer(uint256 _tokenId, uint8 _currencyId, uint256 _price) public {
        nftCollection.transferFrom(msg.sender, address(this), _tokenId);
        offerCount ++;
        offers[offerCount] = _Offer(offerCount, _tokenId, msg.sender, _price, _currencyId, false, false);
        emit OfferCreated(offerCount, _tokenId, msg.sender, _price, _currencyId, false, false);
    }

    function fillOffer(uint256 _offerId) public {
        _Offer storage _offer = offers[_offerId];
        require(_offer.offerId == _offerId, 'The offer must exist');
        require(_offer.user != msg.sender, 'The owner of the offer cannot fill it');
        require(!_offer.fulfilled, 'An offer cannot be fulfilled twice');
        require(!_offer.cancelled, 'A cancelled offer cannot be fulfilled');

        uint256 authorReward = _offer.price.mul(AUTHOR_ROYALTY).div(10000);
        uint256 ownerReward = _offer.price.mul(OWNER_ROYALTY).div(1000);
        uint256 sellerReward = _offer.price.sub(authorReward).sub(ownerReward);

        IERC20 rewardToken = currencies[_offer.currencyId];

        require(rewardToken.transferFrom(msg.sender, AUTHOR, authorReward));
        require(rewardToken.transferFrom(msg.sender, OWNER, ownerReward));
        require(rewardToken.transferFrom(msg.sender, _offer.user, sellerReward));

        nftCollection.transferFrom(address(this), msg.sender, _offer.tokenId);
        _offer.fulfilled = true;
        emit OfferFilled(_offerId, _offer.tokenId, msg.sender);
    }

    function cancelOffer(uint256 _offerId) public {
        _Offer storage _offer = offers[_offerId];
        require(_offer.offerId == _offerId, 'The offer must exist');
        require(_offer.user == msg.sender, 'The offer can only be canceled by the owner');
        require(_offer.fulfilled == false, 'A fulfilled offer cannot be cancelled');
        require(_offer.cancelled == false, 'An offer cannot be cancelled twice');
        nftCollection.transferFrom(address(this), msg.sender, _offer.tokenId);
        _offer.cancelled = true;
        emit OfferCancelled(_offerId, _offer.tokenId, msg.sender);
    }

    // Fallback: reverts if Ether is sent to this smart-contract by mistake
    fallback () external {
        revert();
    }
}