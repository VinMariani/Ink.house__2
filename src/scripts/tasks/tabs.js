export const tabs = () => {
	const buttons_list = document.getElementById('tabsCountriesButtons');
	const buttons = buttons_list.querySelectorAll('button');
	const tabs_list = document.getElementById('tabsCountries');
	const tabsItems = tabs_list.querySelectorAll('.catalog__main-item');
	const active = 'active';
	function createTabs() {
		function cleanActive() {
			buttons.forEach((button) => {
				if (button.classList.contains(active)) {
					button.classList.remove(active)
				}
			})
			tabsItems.forEach((item) => {
				if (item.classList.contains(active)) {
					item.classList.remove(active)
				}
			})
		}
		buttons.forEach((button, index) => button.addEventListener('click', () => {
			cleanActive();
			if (tabsItems[index].classList.contains(active)) {
				tabsItems[index].classList.remove(active);
				button.classList.remove(active);
			}
			tabsItems[index].classList.toggle(active);
			button.classList.toggle(active);
		}))
	}
	createTabs();
}