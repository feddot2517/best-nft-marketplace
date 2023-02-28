// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721 {
    function name() external view virtual returns (string memory);

    function symbol() external view virtual returns (string memory);
}

contract CallHelper {
    struct Collection {
        string name;
        string symbol;
    }

    function collectionInfos(address[] memory _collections) external view returns(Collection[] memory res) {
        res = new Collection[](_collections.length);

        for(uint i = 0; i < _collections.length; i++) {
            IERC721 col = IERC721(_collections[i]);

            string memory name = col.name();
            string memory symbol = col.symbol();

            res[i] = Collection(name, symbol);
        }
        return res;
    }

    function collectionInfo(address _collection) external view returns(string memory) {
        IERC721 col = IERC721(_collection);

        string memory name = col.name();
        return name;
    }
}