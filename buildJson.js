//chatgpt
function extractDataFromElement(element) {
    // Получаем текст из ссылки внутри заголовка h3.cat_title
    const categoryName = element.querySelector('h3.cat_title a').textContent.trim();

    // Получаем таблицу с классом forums
    const forumsTable = element.querySelector('.forums');

    // Создаем объект для хранения данных текущей категории
    const categoryData = {
        category: categoryName,
        ids: [],
        forums: []
    };

    // Проходимся по всем строкам таблицы
    forumsTable.querySelectorAll('tr').forEach(row => {
        // Получаем идентификатор строки
        const rowId = row.id.match(/\d+/); // Получаем только числа из идентификатора

        // Если найдено число, добавляем его в массив ids
        if (rowId) {
            categoryData.ids.push(parseInt(rowId[0])); // Преобразуем строку в число и добавляем в массив
        }

        // Получаем название из селектора h4.forumlink
        const forumName = row.querySelector('h4.forumlink').textContent.trim();

        // Получаем все span.sf_title внутри p.subforums
        const subforums = row.querySelectorAll('p.subforums span.sf_title');

        // Создаем массив для хранения информации о подфорумах
        const subforumsData = [];
        subforums.forEach(span => {
            const subforumName = span.querySelector('a').textContent.trim();
            const subforumId = span.querySelector('a').getAttribute('href').match(/\d+/)[0]; // Получаем только цифры из href
            subforumsData.push({ name: subforumName, id: parseInt(subforumId) }); // Преобразуем строку в число и добавляем в массив
        });

        // Добавляем информацию о форуме и его подфорумах в массив forums
        categoryData.forums.push({ name: forumName, subforums: subforumsData });
    });

    return categoryData;
}