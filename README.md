# Gulp шаблон для создания проектов


## Структура папок шаблона
```
project
    |--build (результат сборки)
    |    |--/*.html (основные файлы проекта)
    |    |--src
    |        |--css
    |        |--/style.сss (основной файл)
    |        |--fonts
    |        |--img
    |        |--js
    |        |--templates
    |        |--vendor (подключаемые библиотеки)
    |--src (исходники для сборки)
    |    |--css
    |        |--style.scss (основной компилируемый файл)
    |        |--base (import scss, базовые элементы)
    |        |--components (import scss, компоненты в блоках)
    |        |--layout (import scss, стили блоков, как header, footer)
    |        |--abstracts (функции, переменные, миксины)
    |    |--fonts
    |    |--img
    |    |--js
    |    |--templates
    |    |--vendor (подключаемые библиотеки)
    |--/*.html (основные файлы)
```

