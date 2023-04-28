// let regionList;
// const inputElement = document.getElementById("input");

// function fromServer(url, params, calaBack) {
//     return new Promise(() => {
//         fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: params
//         })
//             .then(response => {
//                 const status = response.status;
//                 response.text().then(json => {
//                     const data = JSON.parse(json);
//                     calaBack(data);
//                 });
//             })
//             .catch(error => {
//                 console.error('Ошибка:', error);
//                 calaBack(error);
//             });
//     });
// }

// function innerData(data) {
//     let list = document.querySelector("#list");
//     list.innerHTML = "";
//     if (data.length != 0) {
//         data.forEach(element => {
//             list.innerHTML = list.innerHTML + "<li>" + element.name + "</li>";
//         });
//     }
//     else {
//         list.innerHTML = "Нет соответствующих зон";
//     }
// }

// function calaBack(data) {
//     regionList = data;
//     innerData(data);
// }


// inputElement.addEventListener("input", function (event) {
//     let text = event.target.value
//     let result = regionList.filter(function (item) {
//         return item.name.toLowerCase().startsWith(text.toLowerCase());
//     });
//     innerData(result);
// });


// fromServer("/new-data", null, calaBack);

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