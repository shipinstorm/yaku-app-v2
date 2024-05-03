type statusLabel = {
    [key: string]: String;
};

const TxStatusLabel: statusLabel = {
    BID: 'Placed Bid',
    LISTING: 'Listed',
    TRANSACTION: 'Sold',
    CANCELBID: 'Cancelled Bid',
    DELISTING: 'Delisted',
    // eth nft case - reservoir api
    bid: 'Placed Bid',
    ask: 'Placed Offer',
    transfer: 'Transfer',
    sale: 'Sold',
    mint: 'Mint',
    bid_cancel: 'Cancelled Bid',
    ask_cancel: 'Cancelled Offer',
    // my transaction activities
    list: 'Listed',
    cancelBid: 'Cancelled Bid',
    delist: 'Delisted',
    undefined: 'Unknown'
};

export default TxStatusLabel;
