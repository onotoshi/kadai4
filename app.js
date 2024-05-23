document.addEventListener('DOMContentLoaded', () => {
    generateCalendar(2024, 6); // 初期表示は2024年6月
    setupFileUpload();
});

function generateCalendar(year, month) {
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    const currentMonthDisplay = document.getElementById('currentMonth');
    currentMonthDisplay.innerHTML = `${year}年${monthNames[month - 1]}`;

    const daysInMonth = new Date(year, month, 0).getDate();
    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = ''; // 既存のカレンダーをクリア

    const memoData = JSON.parse(localStorage.getItem('memos')) || {};

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month}-${day}`;
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.toLocaleString('ja-JP', { weekday: 'short' });
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${day}日 ${dayOfWeek}</td>
                        <td>
                            <textarea class="memo" data-date="${dateStr}" placeholder="予定を入力">${memoData[dateStr] ? memoData[dateStr].memo : ''}</textarea>
                            <textarea class="memo" data-date="${dateStr}" placeholder="メモ1">${memoData[dateStr] ? memoData[dateStr].memo1 : ''}</textarea>
                            <textarea class="memo" data-date="${dateStr}" placeholder="メモ2">${memoData[dateStr] ? memoData[dateStr].memo2 : ''}</textarea>
                        </td>
                        <td>
                            <textarea class="memo2" data-date="${dateStr}" placeholder="メモ2-1">${memoData[dateStr] ? memoData[dateStr].memo2_1 : ''}</textarea>
                            <textarea class="memo2" data-date="${dateStr}" placeholder="メモ2-2">${memoData[dateStr] ? memoData[dateStr].memo2_2 : ''}</textarea>
                            <textarea class="memo2" data-date="${dateStr}" placeholder="メモ2-3">${memoData[dateStr] ? memoData[dateStr].memo2_3 : ''}</textarea>
                        </td>`;
        calendarBody.appendChild(tr);
    }

    addAutoSave();
}

function addAutoSave() {
    const memos = document.querySelectorAll('.memo, .memo2');
    memos.forEach(memo => {
        memo.addEventListener('input', () => {
            saveMemo(memo);
        });
    });
}

function saveMemo(memo) {
    const memoData = JSON.parse(localStorage.getItem('memos')) || {};
    const date = memo.getAttribute('data-date');

    if (!memoData[date]) {
        memoData[date] = {};
    }

    if (memo.placeholder === "予定を入力") {
        memoData[date].memo = memo.value;
    } else if (memo.placeholder === "メモ1") {
        memoData[date].memo1 = memo.value;
    } else if (memo.placeholder === "メモ2") {
        memoData[date].memo2 = memo.value;
    } else if (memo.placeholder === "メモ2-1") {
        memoData[date].memo2_1 = memo.value;
    } else if (memo.placeholder === "メモ2-2") {
        memoData[date].memo2_2 = memo.value;
    } else if (memo.placeholder === "メモ2-3") {
        memoData[date].memo2_3 = memo.value;
    }

    localStorage.setItem('memos', JSON.stringify(memoData));
}

function promptPassword() {
    const password = prompt('パスワードを入力してください:');
    if (password === '1117') {
        clearAllMemos();
    } else {
        alert('パスワードが間違っています');
    }
}

function clearAllMemos() {
    if (confirm('全てのメモをクリアしますか？')) {
        localStorage.removeItem('memos');
        generateCalendar(2024, 6); // 現在の月を再生成
    }
}

function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('dropArea');
    const fileList = document.getElementById('fileList');

    fileInput.addEventListener('change', handleFiles);
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('drop', handleDrop);

    function handleFiles(event) {
        const files = event.target.files;
        for (const file of files) {
            displayFile(file);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
        dropArea.classList.add('dragover');
    }

    function handleDrop(event) {
        event.preventDefault();
        dropArea.classList.remove('dragover');
        const files = event.dataTransfer.files;
        for (const file of files) {
            displayFile(file);
        }
    }

    function displayFile(file) {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            fileItem.appendChild(img);
        };
        fileReader.readAsDataURL(file);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            fileItem.remove();
        });
        fileItem.appendChild(deleteButton);
        fileList.appendChild(fileItem);
    }
}
