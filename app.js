let defaultUserName = 'Zielonyy3';

const getUserDetails = userName => {
    let xhr = new XMLHttpRequest();
    let userDetails;
    xhr.open('GET', `https://api.github.com/users/${userName}`, true)

    xhr.onload = function () {
        if (this.status == 200) {
            userDetails = JSON.parse(this.responseText);
            console.log('User details downloaded: ', userDetails);

            document.querySelector('.user-info').classList.remove('hidden');
            document.querySelector('.user-information-avatar').src = userDetails.avatar_url;
            document.querySelector('.user-information-name').innerHTML = userDetails.login;
            document.querySelector('.user-information-other').innerHTML = userDetails.created_at;
        }
    }
    xhr.send();
}

const getUserRepos = userName => {
    const changePage = e => {
        document.querySelectorAll('.repos-list').forEach(list => list.classList.add('hidden'));
        document.querySelector(`.repo-page-${e.target.textContent}`).classList.remove('hidden');

        document.querySelectorAll('.list-number').forEach(btn => btn.classList.remove('actual-page'));
        e.target.classList.add('actual-page');
    }
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.github.com/users/${userName}/repos`, true);

    xhr.onload = function () {
        if (this.status == 200) {
            const userRepos = JSON.parse(this.responseText);
            console.log('Repos downloaded: ', userRepos);

            let list = [];
            let pageNumber = Math.ceil(userRepos.length / 10)
            const buttonsDiv = document.querySelector('.page-number');
            buttonsDiv.innerHTML = '';

            for (let i = 0; i < pageNumber; i++) {
                list.push([]);
            }

            userRepos.forEach((repo, i) => list[parseInt(i / 10)].push(repo.name));

            let htmlList = '';
            list.forEach((page, i) => {
                const button = document.createElement("p");
                button.classList.add('list-number');
                if (i == 0) button.classList.add('actual-page');
                button.innerHTML = i + 1;
                button.addEventListener('click', changePage);
                buttonsDiv.appendChild(button);

                htmlList += i == 0 ? `<ul class="repos-list repo-page-${i+1}">` : `<ul class="repos-list repo-page-${i+1} hidden">`;
                console.log(i, list.length - 1);
                page.forEach(repo => {
                    htmlList += `<li class="repos-list-item">${repo}</li>`;
                })

                htmlList += `</ul>`
            })
            document.querySelector('.repos-lists').innerHTML = htmlList;
        }
    }
    xhr.send();
}

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    userName = document.querySelector('#user-name').value != '' ? document.querySelector('#user-name').value : defaultUserName;
    getUserDetails(userName);
    getUserRepos(userName);
})