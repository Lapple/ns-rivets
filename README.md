## Адаптер Rivets.js для Noscript

Полная перерисовка HTML-нод у видов убивает анимацию и может быть излишней при
незначительных изменениях моделей. Например, когда нужно переставить класс
при смене определенного состояния или изменить текст в одной из внутренних нод.

Это подход к решению обеих проблем за счет использования DOM-шаблонизации,
используемой в том или ином виде во фреймворках [Knockout](http://knockoutjs.com)
и [Angular](http://angularjs.org). В качестве движка DOM-шаблонизации используется
микробиблиотека [Rivets.js](http://rivetsjs.com).

### ns.ViewRivets

Вид, который будет использовать на DOM-шаблонизацию, должен указать `ns.ViewRivets`
в качестве базового класса: [TODO: Про инвалидацию вида]

```js
ns.View.define('order', {
    models: ['order'],
}, ns.ViewRivets);
```

Yate-шаблон:

```html
match .order ns-view-content {
    <div class="order" rv-class-order_complete="models.order:complete">
        // rv-атрибут выше примерно соотносится с традиционной записью
        //
        //     if models.order.complete {
        //         @class += " order_complete"
        //     }

        <span class="order__assignee">
            '{{ models.order:assignee }}'
        </span>

        // ... Ниже много другого, нечасто меняющегося, HTML
    </div>
}
```

### Доступные binder-ы

Для подписки на изменение атрибутов модели используется binder `:`. Ниже,
например, происходит скрытие или показ блока в зависимости от значения
`.deleted` на модели `message`:

    <div rv-hide="models.message:deleted"></div>

Для подписки на изменение содержимого модели-коллекции можно использовать
binder `*`. Это удобно, например, для динамической отрисовки списков:

```html
<div class="todos">
    <div class="todo" rv-each-todo="models.todos*">
        <input type="checkbox" rv-checked="todo:complete" />
        '{{ todo:title }}'
    </div>
</div>
```

Более подробно можно посмотреть в примере, вид `view-messages.js`.

### Просмотр примеров использования

Склонируйте репозиторий, перейдите в его корень и выполните:

    npm install && npm run examples

После запуска сервера перейдите по `http://localhost:8181/examples/` в браузере.
