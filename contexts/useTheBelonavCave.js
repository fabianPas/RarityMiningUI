import	React, {useState, useEffect, useContext, createContext}	from	'react';
import	useWeb3													from	'contexts/useWeb3';
import	{ethers}												from	'ethers';
import	{Provider, Contract}									from	'ethcall';
import	THE_BELONAV_CAVE_ABI											from	'utils/theBelonavCave.abi';

const	TheBelonavCaveContext = createContext();

async function newEthCallProvider(provider) {
	const	ethcallProvider = new Provider();
	await	ethcallProvider.init(provider);
	return	ethcallProvider;
}

export const TheBelonavCaveContextApp = ({children, adventurer}) => {
	const	{chainID, provider} = useWeb3();
	const	[cave, set_cave] = useState({});

	/**************************************************************************
	**	Prepare the multicall to get most of the data
	**************************************************************************/
	function		prepareCaveCalls() {
		const	cave = new Contract(process.env.THE_BELONAV_CAVE_ADDR, THE_BELONAV_CAVE_ABI);
		return [
			cave.prospect(adventurer.tokenID),
			//cave.collect(adventurer.tokenID)
		];
	}
	/**************************************************************************
	**	Fetch the data from the prepared multicall to get most of the data
	**************************************************************************/
	async function	fetchCave(calls) {
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
	function	setCave(multicallResult) {
		const	[prospect, collect] = multicallResult;
		
		set_cave({
			tokenID: adventurer.tokenID,
			prospect: Number(prospect),
			collect: Number(collect),
		});
	}

	/**************************************************************************
	**	Prepare the rarities update from ftmscan result
	**************************************************************************/
	async function	prepareCave() {
		const	callResults = await fetchCave(prepareCaveCalls());
		setCave(callResults);
	}

	useEffect(() => {
		if (adventurer.tokenID)
			prepareCave();
	}, [adventurer.tokenID]);

	return (
		<TheBelonavCaveContext.Provider value={{cave}}>
			{children}
		</TheBelonavCaveContext.Provider>
	);
};

export const useTheBelonavCave = () => useContext(TheBelonavCaveContext);
export default useTheBelonavCave;