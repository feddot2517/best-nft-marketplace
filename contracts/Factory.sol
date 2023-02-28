pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NftMarketplace.sol";
import "./ERC721.sol";

contract Factory is Ownable {
    uint8 public OWNER_ROYALTY = 20; // 2%
    uint8 public MAX_AUTHOR_ROYALTY = 200; // 20%
    uint8 public MAX_ACCEPTED_CURRENCIES = 2;
    mapping (address => NFTMarketplace) public marketplaces;

    event NewMarketplace(address _market, address _nftCollection, address[] _acceptedCurrencies, uint8 _authorRoyalty);

    function createMarketplace(
        address _nftCollection,
        address[] memory _acceptedCurrencies,
        uint8 _authorRoyalty
    ) external {

        //TODO CHECK MARKETCREATED
        //TODO CHECK MARKETCREATED
        //TODO CHECK MARKETCREATED
        //TODO CHECK MARKETCREATED
        //TODO CHECK MARKETCREATED
        //TODO CHECK MARKETCREATED
        //TODO CHECK MARKETCREATED
        //TODO CHECK MARKETCREATED

        require(_acceptedCurrencies.length <= MAX_ACCEPTED_CURRENCIES, "MAX_ACCEPTED_CURRENCIES exceeded");
        require(_authorRoyalty <= MAX_AUTHOR_ROYALTY, "MAX_AUTHOR_ROYALTY exceeded");
        require(NftCollection(_nftCollection).owner() == msg.sender, "sender is not collection owner");

        NFTMarketplace nftMarket = new NFTMarketplace(
            _nftCollection, _acceptedCurrencies, msg.sender, _authorRoyalty, OWNER_ROYALTY
        );

        marketplaces[_nftCollection] = nftMarket;
        emit NewMarketplace(address(nftMarket), _nftCollection, _acceptedCurrencies, _authorRoyalty);
    }

    function setOwnerRoyalty(uint8 _royalty) external onlyOwner {
        OWNER_ROYALTY = _royalty;
    }

    function setMaxAuthorRoyalty(uint8 _royalty) external onlyOwner {
        MAX_AUTHOR_ROYALTY = _royalty;
    }
}
