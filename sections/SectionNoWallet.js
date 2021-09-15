import	React, {useState}				from	'react';
import	DialogBox						from	'components/DialogBox';
import	ModalLogin						from	'components/ModalLogin';

function	SectionNoWallet() {
	const	[modalLoginOpen, set_modalLoginOpen] = useState(false);

	return (
		<section className={'mt-12 max-w-full'}>
			<div className={'max-w-screen-lg w-full mx-auto'}>
				<DialogBox
					options={[
						{label: 'Connect wallet', onClick: () => set_modalLoginOpen(true)},
					]} />
			</div>
			<ModalLogin open={modalLoginOpen} set_open={set_modalLoginOpen} />
		</section>
	);		
}

export default SectionNoWallet;
