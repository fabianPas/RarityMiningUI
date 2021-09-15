import	React			from	'react';

function	Footer() {


	return (
		<div className={'absolute bottom-3 text-center text-xxs left-0 right-0 flex flex-col justify-center items-center italic'}>
			<div>
				{'Rarity Mining UI is based on '}
				<a href={'https://github.com/TBouder/RarityExtended'} target={'_blank'} rel={'noreferrer'} className={'hover:underline'}>
					{'RarityExtended'}
				</a>
			</div>
		</div>
	);
}
export default Footer;