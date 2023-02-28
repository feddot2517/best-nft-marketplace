# Listed collection

Used to get a list of all listed collections.

**URL** : `/api/collections/`

**Method** : `GET`

**Params**

```json
{
    "limit": "[number]",
    "offset": "[number]"
}
```

**Data example**

```json
[
  {
    "name": "Collection",
    "symbol": "CLT",
    "address": "0x3791792d19176eD15e70f054918C46A600D24768",
    "offers24hr": "number",
    "offersTotal": "number",
  }
]
```

# Offers

Used to get a list of all listed collections.

**URL** : `/api/offers`
,
**Method** : `GET`

**Params**

```json
{
    "limit": "number",
    "offset": "number",
    "user?": "string",
    "collection?": "string",
    "state?": "fulfilled|cancelled",
    "sort?": "price|created|updated",
    "sortOrder?": "asc|desc"
}
```

**Data example**

```json
[
  {
    "offerId": "string",
    "tokenId": "string",
    "user": "string",
    "price": "string",
    "currencyId": "string",
    "fulfilled": "bool",
    "createdAt": "date",
    "updatedAd": "date"
  }
]
```

# API urls
* /api/offers/
* /api/user/:address/info GET POST
* /api/user/:address/history GET POST
* /api/collections
* /api/collection/:collectionAddress/
* /api/collection/:collectionAddress/metadata GET, POST
* /api/collection/:collectionAddress/tokens GET
