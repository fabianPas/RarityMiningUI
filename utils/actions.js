import	{ethers}			from	'ethers';
import	toast				from	'react-hot-toast';

export async function collect({provider, contractAddress, tokenID}, callback) {
	const	_toast = toast.loading(`Collecting rocks for summoner ${tokenID}...`);
	const	signer = provider.getSigner();
	const	theBelonavCave = new ethers.Contract(
		contractAddress,
		['function collect(uint summonerId) public returns (uint rarocksMined)'],
		signer
	);

	/**********************************************************************
	**	In order to avoid dumb error, let's first check if the TX would
	**	be successful with a static call
	**********************************************************************/
	let result = 0;
	try {
		result = await theBelonavCave.callStatic.collect(tokenID);
	} catch (error) {
		toast.dismiss(_toast);
		toast.error('Impossible to submit transaction');
		callback({error, data: undefined});
		return;
	}

	/**********************************************************************
	**	If the call is successful, try to perform the actual TX
	**********************************************************************/
	try {
		const	transaction = await theBelonavCave.collect(tokenID);
		const	transactionResult = await transaction.wait();
		if (transactionResult.status === 1) {
			callback({error: false, data: transactionResult, rocksMined: result});
			toast.dismiss(_toast);
			toast.success('Transaction successful');
		} else {
			toast.dismiss(_toast);
			toast.error('Transaction reverted');
			callback({error: true, data: undefined});
		}
	} catch (error) {
		console.error(error);
		toast.dismiss(_toast);
		toast.error('Something went wrong, please try again later.');
		callback({error, data: undefined});
	}
}
