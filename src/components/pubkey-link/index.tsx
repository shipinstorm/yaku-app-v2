import { shortenAddress } from '../../utils/utils';

interface Props {
    pubkey: string;
    prefixSize?: number;
    customClass?: string;
    type?: string;
}

const PubkeyLink = ({ pubkey, customClass, prefixSize, type = 'account' }: Props) => (
    <a
        href={`https://explorer.solana.com/${type === 'account' ? 'address' : 'tx'}/${pubkey}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-sm block whitespace-nowrap bg-transparent text-blueGray-700 w-full ${customClass ? ` ${customClass}` : ''}`}
    >
        {shortenAddress(pubkey, prefixSize)}
    </a>
);

export default PubkeyLink;
