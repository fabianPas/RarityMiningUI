import React, {useState, useEffect} from 'react';
import useWeb3 from 'contexts/useWeb3';
import {Provider, Contract} from 'ethcall';
import THE_BELONAV_CAVE_ABI from 'utils/theBelonavCave.abi';
import	{collect}	from	'utils/actions';

const cave = new Contract(process.env.THE_BELONAV_CAVE_ADDR, THE_BELONAV_CAVE_ABI);

async function newEthCallProvider(provider) {
	const ethcallProvider = new Provider();
	await ethcallProvider.init(provider);
	return ethcallProvider;
}

function prepareProspectCall(rarity) {
	return [
		cave.prospect(rarity.tokenID),
	];
}

function prepareVisitorLogCall(rarity) {
	return [
		cave.visitorLog(rarity.tokenID),
	];
}

async function executeCalls(provider, chainID, calls) {
	const ethcallProvider = await newEthCallProvider(provider);
	const callResult = await ethcallProvider.all(calls);
	return (callResult);
}

async function getProspectResult(rarity, chainID, provider) {
	const calls = prepareProspectCall(rarity);

	const callResults = await executeCalls(provider, chainID, calls);
	return callResults[0].toNumber() / 10;
}

async function getVisitorLogResult(rarity, chainID, provider) {
	const calls = prepareVisitorLogCall(rarity);

	const callResults = await executeCalls(provider, chainID, calls);
	return callResults[0].toNumber();
}

async function doCollect(rarity, chainID, provider, updateRarity, setVisitorLog) {
	await collect({provider, contractAddress: cave.address, tokenID: rarity.tokenID},
		(data) => {
			if (data.error) {
				console.error(data.error);
				return;
			}
			updateRarity(rarity.tokenID);
			const now = Date.now();
			setVisitorLog(Math.round(now/1000) + (60*60));
		});
}

function TheBelonavCaveControls({rarity, updateRarity}) {
	const {chainID, provider} = useWeb3();
	const [rocksProspected, setRocksProspected] = useState(null);
	const [secondsLeft, setSecondsleft] = useState(0);
	const [visitorLog, setVisitorLog] = useState(-1);

	useEffect(() => {
		const timer = setTimeout(() => {
			updateTimeLeft();
		}, 1000);
		return () => clearTimeout(timer);
	});

	function updateTimeLeft() {
		if (visitorLog === -1) {
			getVisitorLogResult(rarity, chainID, provider).then((result) => {
				setVisitorLog(result);
			});
		}
		const newSecondsLeft = visitorLog - Math.round(Date.now()/1000);
		if (newSecondsLeft < 0) {
			setSecondsleft(0);
			return;
		}
		setSecondsleft(newSecondsLeft);
	}

	if (secondsLeft > 0) {
		let inSeconds = secondsLeft;
		let inMinutes = Math.floor(inSeconds/60);
		inSeconds = inSeconds-(inMinutes*60);

		return (
			<div className={'flex flex-row items-center w-full py-2'}>
				<div className={'w-full text-center md:text-center pr-4 md:pr-0 mb-3'}>
					{'Your summoner is resting.'}<br />
					<span className={'text-sm'}>{inMinutes +  ' minutes & ' + inSeconds + ' seconds left'}</span>
				</div>
			</div>
		);
	}

	return (
		<div className={'flex flex-row items-center w-full py-2'}>
			<div className={'w-full text-right md:text-left pr-4 md:pr-0 mb-3'}>
				<button
					onClick={async () => {
						const prospectResult = await getProspectResult(rarity, chainID, provider);
						setRocksProspected(prospectResult);
					}}
					className={'w-full px-3 py-2 content-center leading-4 text-xs cursor-pointer whitespace-nowrap font-bold border-2 border-solid border-black dark:border-dark-100 ' + (rocksProspected != null ? 'hidden' : '')}>
					<span>{'🔍 Prospect rocks'}</span>
				</button>
				<button
					onClick={async () => {
						doCollect(rarity, chainID, provider, updateRarity, setVisitorLog);
					}}
					className={'w-full px-3 py-2 content-center leading-4 text-xs cursor-pointer whitespace-nowrap font-bold border-2 border-solid border-black dark:border-dark-100 ' + (rocksProspected == null ? 'hidden' : '')}>
					<span>{'⛏️ Mine rocks'}</span>
				</button>
				<div className={(rocksProspected == null ? 'hidden' : '') + ' text-center mt-2'}>
					<span className={'text-sm'}>{'Seems like you will be able to mine ' + rocksProspected + ' rocks'}</span>
				</div>
			</div>
		</div>	
	);
}

export default TheBelonavCaveControls;