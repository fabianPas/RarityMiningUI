/* eslint-disable react-hooks/exhaustive-deps */

import	React, {useState, useEffect, useContext, createContext}	from	'react';
import	useWeb3													from	'contexts/useWeb3';
import	{ethers}												from	'ethers';
import	{Provider, Contract}									from	'ethcall';
import	useSWR													from	'swr';
import	{chunk, fetcher, toAddress}									from	'utils';
import	RARITY_ABI												from	'utils/rarity.abi';
import	RARITY_ATTR_ABI											from	'utils/rarityAttr.abi';
import  RARITY_ROCK_ABI											from    'utils/rarityRock.abi';

const	RarityContext = createContext();

async function newEthCallProvider(provider) {
	const	ethcallProvider = new Provider();
	await	ethcallProvider.init(provider);
	return	ethcallProvider;
}

export const RarityContextApp = ({children}) => {
	const	{active, address, chainID, provider} = useWeb3();
	const	getRaritiesRequestURI = `
		https://api.ftmscan.com/api
		?module=account
		&action=tokennfttx
		&contractaddress=${process.env.RARITY_ADDR}
		&address=${address}
		&apikey=${process.env.FMT_KEY}`;

	const	{data} = useSWR(active && address ? getRaritiesRequestURI : null, fetcher);

	const	[rarities, set_rarities] = useState({});
	const	[rNonce, set_rNonce] = useState(0);
	const	[loaded, set_loaded] = useState(false);
	const   [rarityRockBalance, set_rarity_rock_balance] = useState(0);

	/**************************************************************************
	**	Reset the rarities when the chain changes, when the address changes or
	**	when the web3 become inactive.
	**************************************************************************/
	useEffect(() => {
		set_rarities({});
		set_rNonce(n => n + 1);
	}, [active, address, chainID]);

	async function	 fetchRarityRockBalance(address)
	{
		const	rarityRock = new Contract(process.env.RARITY_ROCK_ADDR, RARITY_ROCK_ABI);
		let call = [
			rarityRock.balanceOf(address)
		];

		if (Number(chainID) === 1337) {
			const	ethcallProvider = await newEthCallProvider(new ethers.providers.JsonRpcProvider('http://localhost:8545'));
			ethcallProvider.multicallAddress = '0xc04d660976c923ddba750341fe5923e47900cf24';
			const	callResult = await ethcallProvider.all(call);
			return (callResult);
		} else {
			const	ethcallProvider = await newEthCallProvider(provider);
			const	callResult = await ethcallProvider.all(call);
			return (callResult);
		}
	}

	/**************************************************************************
	**	Prepare the multicall to get most of the data
	**************************************************************************/
	function		prepareAdventurer(tokenID) {
		const	rarity = new Contract(process.env.RARITY_ADDR, RARITY_ABI);
		const	rarityAttr = new Contract(process.env.RARITY_ATTR_ADDR, RARITY_ATTR_ABI);
		const	rarityRock = new Contract(process.env.RARITY_ROCK_ADDR, RARITY_ROCK_ABI);

		return [
			rarity.ownerOf(tokenID),
			rarity.summoner(tokenID),
			rarityAttr.character_created(tokenID),
			rarityAttr.ability_scores(tokenID),
			rarityRock.balancePerSummoner(tokenID)
		];
	}
	/**************************************************************************
	**	Fetch the data from the prepared multicall to get most of the data
	**************************************************************************/
	async function	fetchAdventurer(calls) {
		if (Number(chainID) === 1337) {
			const	ethcallProvider = await newEthCallProvider(new ethers.providers.JsonRpcProvider('http://localhost:8545'));
			ethcallProvider.multicallAddress = '0xc04d660976c923ddba750341fe5923e47900cf24';
			const	callResult = await ethcallProvider.all(calls);
			return (callResult);
		} else {
			const	ethcallProvider = await newEthCallProvider(provider);
			const	callResult = await ethcallProvider.all(calls);
			return (callResult);
		}
	}

	/**************************************************************************
	**	Actually update the state based on the data fetched
	**************************************************************************/
	function	setRarity(tokenID, multicallResult) {
		const	[owner, adventurer, initialAttributes, abilityScores, rockBalance] = multicallResult;

		if (toAddress(owner) !== toAddress(address)) {
			return;
		}
		set_rarities((prev) => ({...prev, [tokenID]: {
			tokenID: tokenID,
			owner: owner,
			xp: ethers.utils.formatEther(adventurer['_xp']),
			class: Number(adventurer['_class']),
			level: Number(adventurer['_level']),
			log: Number(adventurer['_log']),
			attributes: {
				isInit: initialAttributes,
				remainingPoints: initialAttributes ? -1 : 32,
				strength: initialAttributes ? abilityScores['strength'] : 8,
				dexterity: initialAttributes ? abilityScores['dexterity'] : 8,
				constitution: initialAttributes ? abilityScores['constitution'] : 8,
				intelligence: initialAttributes ? abilityScores['intelligence'] : 8,
				wisdom: initialAttributes ? abilityScores['wisdom'] : 8,
				charisma: initialAttributes ? abilityScores['charisma'] : 8,
			},
			mining: {
				rock: rockBalance.toNumber()
			}
		}}));
		set_rNonce(prev => prev + 1);
	}

	/**************************************************************************
	**	Prepare the rarities update from ftmscan result
	**************************************************************************/
	async function	updateRarities(elements) {
		const	preparedCalls = [];
		const	tokensIDs = [];
		elements?.forEach((token) => {
			preparedCalls.push(...prepareAdventurer(token.tokenID));
			tokensIDs.push(token.tokenID);
		});

		const	callResults = await fetchAdventurer(preparedCalls);
		const	chunkedCallResult = chunk(callResults, 5);
		tokensIDs?.forEach((tokenID, i) => {
			setRarity(tokenID, chunkedCallResult[i]);
		});
		set_loaded(true);
	}

	/**************************************************************************
	**	Prepare the rarities update from in-app update
	**************************************************************************/
	async function	updateRarity(tokenID) {
		const	callResults = await fetchAdventurer(prepareAdventurer(tokenID));
		const	chunkedCallResult = chunk(callResults, 5);
		setRarity(tokenID, chunkedCallResult[0]);
	}

	/**************************************************************************
	**	Trigger a re-fetch of the rarities from an in-app update
	**************************************************************************/
	async function	fetchRarity() {
		const {result} = await fetcher(`https://api.ftmscan.com/api
			?module=account
			&action=tokennfttx
			&contractaddress=${process.env.RARITY_ADDR}
			&address=${address}
			&apikey=${process.env.FMT_KEY}`);
		await updateRarities(result);
	}

	/**************************************************************************
	**	Once we got data from FTMScan, try to build the rarities
	**************************************************************************/
	useEffect(() => {
		if (data?.result && provider) {
			if (data?.status === 0) {
				return setTimeout(() => fetchRarity(), 100);
			}
			
			updateRarities(data?.result);

			fetchRarityRockBalance(address).then((value) =>
			{ 
				set_rarity_rock_balance(value.toString());
			});
			
		}
	}, [data, provider]);

	useEffect(() => {
		setTimeout(() => !active ? set_loaded(true) : null, 1500);
	}, []);


	return (
		<RarityContext.Provider
			value={{
				isLoaded: loaded,
				rarities,
				updateRarity,
				fetchRarity,
				rNonce,
				rarityRockBalance
			}}>
			{children}
		</RarityContext.Provider>
	);
};

export const useRarity = () => useContext(RarityContext);
export default useRarity;
