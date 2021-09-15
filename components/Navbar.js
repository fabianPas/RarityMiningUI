import	React, {useState, useEffect}	from	'react';
import	Link							from	'next/link';
import	useWeb3							from	'contexts/useWeb3';
import	ModalLogin						from	'components/ModalLogin';
import	useRarity	from	'contexts/useRarity';

function	Navbar() {
	const	{active, address, deactivate, onDesactivate} = useWeb3();
	const	[initialPopup, set_initialPopup] = useState(false);
	const	[modalLoginOpen, set_modalLoginOpen] = useState(false);
	const	{rarityRockBalance} = useRarity();

	useEffect(() => {
		if (initialPopup)
			return;

		if (!address) {
			set_modalLoginOpen(true);
		}
		set_initialPopup(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address]);

	function	renderWalletButton() {
		if (!active) {
			return (
				<button
					onClick={() => set_modalLoginOpen(true)}
					className={'inline-flex px-3 py-2 items-center leading-4 text-xs cursor-pointer whitespace-nowrap border-solid border-2 font-semibold'}>
					<span className={'hidden md:flex'}>{'Connect wallet'}</span>
					<span className={'flex md:hidden'}>{'Connect'}</span>
				</button>
			);
		}
		return (
			<p
				onClick={() => {deactivate(); onDesactivate();}}
				suppressHydrationWarning
				className={'inline-flex px-3 py-2 items-center leading-4 text-xs cursor-pointer whitespace-nowrap border-solid border-2 font-semibold'}>
				<span className={'flex md:hidden'}>{`${address.slice(0, 4)}`}</span>
				<span className={'hidden md:flex'}>{`${address.slice(0, 4)}...${address.slice(-4)}`}</span>
			</p>
		);
	}
	return (
		<nav className={'relative w-full flex flex-col md:flex-row justify-start md:h-20 border-b-4 border-black dark:border-dark-100 mb-4 md:mb-20 pb-0 md:pb-4'}>
			<div className={'items-center justify-start flex flex-row whitespace-normal md:whitespace-nowrap text-lg'}>
				<div className={'w-full'}>
					<Link href={'/'}>
						<p className={'md:block'}>{'Rarity Mining'}<sup className={'text-xs pl-1 text-gray-400'}>{'BETA'}</sup></p>
					</Link>
				</div>
				<div className={'items-center justify-end flex-row flex md:hidden'}>
					{renderWalletButton()}
				</div>
			</div>
			<div className={'items-center justify-start md:justify-end flex flex-row w-full mt-3 md:mt-0'}>
				<div className={'items-center justify-end flex-row gap-x-2 hidden md:flex'}>
					<div>{renderWalletButton()}</div>
					<div>
						<span className={'inline-flex px-3 py-2 items-center leading-4 text-xs whitespace-nowrap border-dotted border-2 font-semibold'}>{'Rarity Rocks: ' + rarityRockBalance.toString()}</span>
					</div>
				</div>
			</div>
			<ModalLogin open={modalLoginOpen} set_open={set_modalLoginOpen} />
		</nav>
	);
}

export default Navbar;
