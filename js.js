

// загрузка списка зон из JSON-файла
fetch('zones')
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Ошибка загрузки списка зон');
        }
    })
    .then(zones => {
        // создание списка зон
        const zoneList = document.getElementById('zone-list');

        zones.forEach(zone => {
            const li = document.createElement('li');
            li.textContent = zone.name;
            li.dataset.id = zone.id;
            zoneList.appendChild(li);
        });

        // обработчик для поиска зон
        const zoneSearchInput = document.getElementById('zone-search');
        zoneSearchInput.addEventListener('input', () => {
            const searchText = zoneSearchInput.value.trim().toLowerCase();
            const zoneItems = zoneList.querySelectorAll('li');

            zoneItems.forEach(item => {
                const zoneName = item.textContent.trim().toLowerCase();
                if (zoneName.startsWith(searchText)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // обработчик для добавления зоны в список выбранных зон
        zoneList.addEventListener('click', e => {
            if (e.target.tagName === 'LI') {
                const selectedZonesList = document.getElementById('selected-zones-list');
                const selectedZoneIds = Array.from(selectedZonesList.children).map(li => li.dataset.zoneId);
                const zoneId = e.target.dataset.id;

                if (!selectedZoneIds.includes(zoneId)) {
                    const li = document.createElement('li');
                    li.textContent = e.target.textContent;
                    li.dataset.zoneId = zoneId;
                    selectedZonesList.appendChild(li);

                    // сохранение выбранной зоны в куки
                    const selectedZones = JSON.parse(localStorage.getItem('selectedZones')) || [];
                    selectedZones.push(zoneId);
                    localStorage.setItem('selectedZones', JSON.stringify(selectedZones));
                }
            }
        });

        // загрузка ранее выбранных зон из куки
        const selectedZoneIds = JSON.parse(localStorage.getItem('selectedZones')) || [];
        const selectedZonesList = document.getElementById('selected-zones-list');

        selectedZoneIds.forEach(zoneId => {
            zones.forEach(zone => {
                if (zone.id == zoneId) {
                    const li = document.createElement('li');
                    li.textContent = zone.name;
                    li.dataset.zoneId = zone.id;
                    selectedZonesList.appendChild(li);
                }
            });
        });

        // обработчик для удаления выбранной зоны из списка выбранных зон
        selectedZonesList.addEventListener('click', e => {
            if (e.target.tagName === 'LI') {
                const selectedZones = JSON.parse(localStorage.getItem('selectedZones')) || [];
                const zoneId = e.target.dataset.zoneId;
                const zoneIndex = selectedZones.indexOf(zoneId);

                if (zoneIndex !== -1) {
                    selectedZones.splice(zoneIndex, 1);
                    localStorage.setItem('selectedZones', JSON.stringify(selectedZones));
                }

                e.target.remove();
            }
        });
    })
    .catch(error => {
        console.error(error);
    });