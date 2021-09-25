import React, {useState} from 'react';
import	classNameMapping				from	'utils/classNameMapping';



function Workshop({rarities}) {
	const	adventurers = Object.values(rarities);
	const [visitor, setVisitor] = useState(adventurers[0]);

	adventurers.forEach((adventurer) => {
		console.log(adventurer);
	});

	function change(event)
	{
		let adventurerId = event.target.value;
		if (adventurerId == null)
			return;

		let visitor = adventurers.find(adventurer => adventurer.tokenID == adventurerId);
		setVisitor(visitor);
	}

	return (
		<section className={'mt-24 md:mt-12'}>
			<div className={'flex flex-col space-y-8 max-w-screen-lg w-full mx-auto'}>
				<div className={'w-full'}>
					<div className={'nes-container py-6 px-4 mb-6 border-4 border-solid border-black dark:border-dark-100 with-title w-full'}>
						<div className={'title bg-white dark:bg-dark-600 mb-1'}>{'Which adventurer is visiting Grevor?'}</div>
						<select onChange={change} className={'block w-full mt-1 rounded-md bg-gray-500 border-transparent focus:border-gray-500 focus:ring-0'}>
							{
								adventurers?.map((rarity) => (
									<option value={rarity.tokenID} key={rarity.tokenID}>{rarity.tokenID}{': Lvl.'}{rarity.level} {classNameMapping[rarity.class]}</option>
								))
							}
						</select>
					</div>
					<div className={'flex flex-col md:flex-row w-full space-x-0 md:space-x-2'}>
						<div className={'nes-container py-6 px-4 border-4 border-solid border-black dark:border-dark-100 with-title w-full'}>
							<div className={'title bg-white dark:bg-dark-600 mb-1'}>{'Grevor\'s Workshop'}</div>
							<div className={'flex flex-row items-center w-full py-2'}>
								<div className={'grid grid-cols-3 gap-4'}>
									<div className={'col-span-1'}>
										<img
											src={'/grevor.png'}
											loading={'eager'}
											width={240}
											height={160} />
										{ (visitor == null) ? '':
											<p className={'text-center'}>{'Welcome'} {classNameMapping[visitor.class]}{'! How can I help you?'}</p>
										}
									</div>
									<div className={'col-span-2'}>
										<p className={'italic mb-6'}>
											{'Grevor is a very crafty dwarf able to supply adventurers with the best mining goods available.'}
										</p>
										<div className={'grid grid-cols-3 gap-4'}>
											<div className={'col-span-1'}>
												<div className={'nes-container pt-6 pb-0 px-4 border-4 border-dashed border-black dark:border-dark-100 with-title w-full content-center'}>
													<div className={'title bg-white dark:bg-dark-600 mb-1'}>{'Stone pickaxe'}</div>
													<img
														src={'/stone-pickaxe.png'}
														loading={'eager'}
														width={80}
														height={80} />
													<span>{'7 pickackes left for today'}</span>

													<div className={'flex flex-row items-center w-full py-2'}>
														<div className={'w-full text-right md:text-left pr-4 md:pr-0 mb-3'}>
															<button
																className={'w-full px-3 py-2 content-center leading-4 text-xs cursor-pointer whitespace-nowrap font-bold border-2 border-solid border-black dark:border-dark-100 mb-2'}>
																<span>{'Request price'}</span>
															</button>
															<button
																className={'w-full px-3 py-2 content-center leading-4 text-xs cursor-pointer whitespace-nowrap font-bold border-2 border-solid border-black dark:border-dark-100'}>
																<span>{'Purchase'}</span>
															</button>
														</div>
													</div>	
												</div>
											</div>
											<div className={'col-span-1'}>
												<div className={'nes-container pt-6 pb-0 px-4 border-4 border-dashed border-black dark:border-dark-100 with-title w-full content-center'}>
													<div className={'title bg-white dark:bg-dark-600 mb-1'}>{'Item 2'}</div>
													<img
														src={'/stone-pickaxe.png'}
														loading={'eager'}
														width={80}
														height={80} />
													<span>{'7 pickackes left for today'}</span>

													<div className={'flex flex-row items-center w-full py-2'}>
														<div className={'w-full text-right md:text-left pr-4 md:pr-0 mb-3'}>
															<button
																className={'w-full px-3 py-2 content-center leading-4 text-xs cursor-pointer whitespace-nowrap font-bold border-2 border-solid border-black dark:border-dark-100 mb-2'}>
																<span>{'Request price'}</span>
															</button>
															<button
																className={'w-full px-3 py-2 content-center leading-4 text-xs cursor-pointer whitespace-nowrap font-bold border-2 border-solid border-black dark:border-dark-100'}>
																<span>{'Purchase'}</span>
															</button>
														</div>
													</div>	
												</div>
											</div>
											<div className={'col-span-1'}>
												<div className={'nes-container pt-6 pb-0 px-4 border-4 border-dashed border-black dark:border-dark-100 with-title w-full content-center'}>
													<div className={'title bg-white dark:bg-dark-600 mb-1'}>{'Item 3'}</div>
													<img
														src={'/stone-pickaxe.png'}
														loading={'eager'}
														width={80}
														height={80} />
													<span>{'7 pickackes left for today'}</span>

													<div className={'flex flex-row items-center w-full py-2'}>
														<div className={'w-full text-right md:text-left pr-4 md:pr-0 mb-3'}>
															<button
																className={'w-full px-3 py-2 content-center leading-4 text-xs cursor-pointer whitespace-nowrap font-bold border-2 border-solid border-black dark:border-dark-100 mb-2'}>
																<span>{'Request price'}</span>
															</button>
															<button
																className={'w-full px-3 py-2 content-center leading-4 text-xs cursor-pointer whitespace-nowrap font-bold border-2 border-solid border-black dark:border-dark-100'}>
																<span>{'Purchase'}</span>
															</button>
														</div>
													</div>	
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Workshop;