import	React							from	'react';
import	dayjs							from	'dayjs';
import	relativeTime					from	'dayjs/plugin/relativeTime';
import	SectionNoAdventurer				from	'sections/SectionNoAdventurer';
import	useWeb3							from	'contexts/useWeb3';
import	useRarity						from	'contexts/useRarity';
import	classNameMapping				from	'utils/classNameMapping';
import  TheBelonavCaveControls 			from    'components/TheBelonavCaveControls';

dayjs.extend(relativeTime);

function	Attribute({name, value}) {
	return (
		<div className={'flex flex-row items-center w-full py-2'}>
			<div className={'opacity-80 text-xs md:text-sm'}>{`${name}: `}</div>
			<div className={'w-full text-right'}>
				<div className={'flex flex-row items-center justify-end'}>			
					<div className={'w-9 text-center'}>{value}</div>
				</div>
			</div>
		</div>
	);
}
function	Attributes({rarity, updateRarity}) {
	return (
		<div className={'nes-container pt-6 pb-0 px-4 border-4 border-dashed border-black dark:border-dark-100 with-title w-full'}>
			<div className={'title bg-white dark:bg-dark-600 mb-1'}>{'Lvl.'}{rarity.level} {classNameMapping[rarity.class]} {rarity.tokenID}</div>
			<Attribute
				value={rarity.attributes.strength}
				name={'strength'} />
			<Attribute
				value={rarity.attributes.dexterity}
				name={'dexterity'} />
			<Attribute
				value={rarity.attributes.constitution}
				name={'constitution'} />
			<Attribute
				value={rarity.attributes.intelligence}
				name={'intelligence'} />
			<Attribute
				value={rarity.attributes.wisdom}
				name={'wisdom'} />
			<Attribute
				value={rarity.attributes.charisma}
				name={'charisma'} />
			<TheBelonavCaveControls rarity={rarity} updateRarity={updateRarity}/>
		</div>
	);
}

function	Aventurers({rarity, provider, updateRarity}) {
	return (
		<div className={'w-full'}>
			<div className={'flex flex-col md:flex-row w-full space-x-0 md:space-x-2'}>
				<Attributes rarity={rarity} updateRarity={updateRarity} provider={provider} />
			</div>
			<div className={'flex flex-col md:flex-row w-full space-x-0 md:space-x-2'}>
				<div className={'nes-container pt-6 pb-0 px-4 border-4 border-dashed border-black dark:border-dark-100 with-title w-full'}>
					<div className={'title bg-white dark:bg-dark-600 mb-1'}>{'Mining inventory'}
						<p>{'Rarity Rocks: ' + (rarity.mining.rock / 10)}</p>
					</div>
				</div>
			</div>
		</div>
	);
}


function	Index() {
	const	{provider, chainTime} = useWeb3();
	const	{rarities, updateRarity} = useRarity();
	const	adventurers = Object.values(rarities);

	if (adventurers?.length === 0) {
		return (
			<SectionNoAdventurer />
		);
	}

	return (
		<section className={'mt-24 md:mt-12'}>
			<div className={'flex flex-col space-y-8 max-w-screen-lg w-full mx-auto'}>
				<div className={'w-full'}>
					<div className={'flex flex-col md:flex-row w-full space-x-0 md:space-x-2'}>
						<div className={'nes-container pt-6 px-4 border-4 border-solid border-black dark:border-dark-100 with-title w-full'}>
							<div className={'title bg-white dark:bg-dark-600 mb-1'}>{'The Belonav Cave'}</div>
							<div className={'flex flex-row items-center w-full py-2'}>
								<div className={'grid grid-cols-3 gap-4'}>
									<div className={'col-span-1'}>
										<img
											src={'/cave.svg'}
											loading={'eager'}
											width={160}
											height={160} />
									</div>
									<div className={'col-span-2 italic'}>{'The Belonav Cave is a damp and rocky cave situated deep within the Leonore Mountains. Large stalactites hang from the ceilings and pose a threat to the brave miners looking for usable rocks. Only strong summoners will be able to carry rocks back into daylight. Due to the treacherous terrain, finding rocks in this cave is a time intensive task.'}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={'grid grid-cols-3 gap-8'}>
					{
						adventurers?.map((rarity) => (
							<Aventurers
								key={rarity.tokenID}
								rarity={rarity}
								provider={provider}
								updateRarity={updateRarity}
								chainTime={chainTime} />
						))
					}
				</div>
			</div>
		</section>
	);
}

export default Index;
