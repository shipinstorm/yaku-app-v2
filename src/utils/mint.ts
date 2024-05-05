import { Connection, PublicKey } from "@solana/web3.js";
import findMetadataAccount from "./metaplex";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { AssetInfo } from "@/types/ms";
import { NATIVE_MINT } from "@solana/spl-token";

const getMintInformation = async (
  connection: Connection,
  mintKey: string | undefined
): Promise<AssetInfo> => {
  if (mintKey) {
    // if it's native sol
    if (mintKey === NATIVE_MINT.toBase58()) {
      return {
        image: "/images/solana-icon.png",
        name: "SOL",
        symbol: "SOL",
      };
    }

    // check if mint has metaplex data
    const mint = new PublicKey(mintKey);
    const [metadataKey] = findMetadataAccount(mint);
    let image = "/images/empty-nft.png";
    let name = "Unknown";
    let symbol = "Unknown";
    try {
      const metadataAccountInfo = await connection.getAccountInfo(
        metadataKey,
        "confirmed"
      );
      if (metadataAccountInfo) {
        const metadata = Metadata.deserialize(
          metadataAccountInfo?.data as Buffer,
          0
        )[0];
        const dataURI = metadata.data.uri;
        if (dataURI) {
          const tokenInfo = (await (await fetch(dataURI)).json()) as AssetInfo;
          if (tokenInfo.image) {
            image = tokenInfo.image;
          }
          name = tokenInfo.name;
          symbol = tokenInfo.symbol;
        }
      }
    } catch (e) {
      console.error(e);
    }

    return {
      image,
      name,
      symbol,
    };
  }
  return {
    image: "",
    name: "",
    symbol: "",
  };
};

export default getMintInformation;
