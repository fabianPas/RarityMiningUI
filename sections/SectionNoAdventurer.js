import	React				from	'react';

function	SectionNoAdventurer() {
	return (
		<section className={'mt-12 max-w-full'}>
			<div className={'max-w-screen-lg w-full mx-auto'}>
				<div className={'flex flex-col md:flex-row items-center md:items-center italic mb-10'}>
					<p>{'You have no available adventurers to mine with. Use one of the following apps to summon an adventurer.'}</p>
				</div>
				<div className={'grid grid-cols-3 gap-4 justify-items-center items-center'}>
					<div className={'content-center p-4 text-center'}>
						<div className={'box'}>
							<div className={'box-inner'}>
								<a href={'https://rarityextended.com'}>
									<h1 className={'pt-16 pb-16 pl-2 pr-2 rarity-extended'}>{'Rarity Extended'}</h1>
								</a>
							</div>
						</div>
					</div>
					<div className={'content-center p-4 text-center'}>
						<div className={'box'}>
							<div className={'box-inner'}>
								<p className={'italic mb-7 text-base'}>{'Rarity Game'}</p>
								<a href={'https://rarity.game'}>
									<img
										src={'/sword.png'}
										className={'mx-auto'}
										loading={'eager'}
										width={140}
										height={100} />
								</a>
							</div>
						</div>
					</div>
					<div className={'content-center p-4 text-center'}>
						<div className={'box'}>
							<div className={'box-inner'}>
								<p className={'italic mb-7 mr-8 ml-8 text-base'}>{'Rarity MMO'}</p>
								<a href={'https://raritymmo.com'}>
									<img
										src={'/fighter-hero.33bebec6.webp'}
										className={'mx-auto '}
										loading={'eager'}
										width={80}
										height={100} />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);		
}

export default SectionNoAdventurer;
