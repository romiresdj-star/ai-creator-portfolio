# AI Portfolio

Портфоліо-сайт для AI-креатора. Проста статика (HTML/CSS/JS), без збірки — деплой на Vercel напряму з GitHub.

## Структура

```
index.html            — головна сторінка
css/style.css          — стилі
js/config.js           — категорії та підкатегорії (тексти)
js/script.js           — логіка галереї, фільтрів, перегляду
data/works.json        — СПИСОК ВСІХ РОБІТ (тут ти будеш додавати нове)
assets/images/         — файли зображень
assets/videos/         — файли відео
assets/thumbnails/     — прев'ю для відео (кадр-обкладинка)
```

## Як додати нову роботу

1. Заший файл (зображення або відео) у `assets/images/` або `assets/videos/`.
   Якщо це відео — додатково зроби картинку-обкладинку (кадр) і поклади в `assets/thumbnails/`.
2. Відкрий `data/works.json` і додай новий об'єкт у масив (не забудь кому перед новим об'єктом).

### Приклад для зображення

```json
{
  "id": "photosession-2026-07-13",
  "category": "images",
  "subcategory": "photosessions",
  "title": "Фотосесія у стилі cyberpunk",
  "description": "AI-генерація образу для клієнта",
  "type": "image",
  "src": "assets/images/photosession-01.jpg"
}
```

### Приклад для відео

```json
{
  "id": "product-video-2026-07-13",
  "category": "video",
  "subcategory": "product",
  "title": "Рекламний ролик кросівок",
  "description": "Динамічне відео товару",
  "type": "video",
  "src": "assets/videos/product-01.mp4",
  "thumbnail": "assets/thumbnails/product-01.jpg"
}
```

### Доступні значення `category` / `subcategory`

- `images`: `photosessions`, `banners`, `restoration`, `stickers`
- `video`: `ugc`, `animation`, `motion`, `product`

Ці значення визначені у `js/config.js` — там же можна змінити назви/опис категорій, які бачить відвідувач.

## Видалення демо-плейсхолдерів

У `data/works.json` зараз лежать 8 демонстраційних записів з `"placeholder": true`.
Коли додаси реальні роботи у відповідну підкатегорію — просто видали відповідний demo-об'єкт (або залиш, поки робіт мало).

## Деплой через GitHub + Vercel

1. Заливаєш проєкт у свій GitHub-репозиторій.
2. У Vercel: New Project → обираєш цей репозиторій → Framework Preset: **Other** (це статичний сайт, білд не потрібен) → Deploy.
3. Далі кожен `git push` у гілку, підключену до Vercel, автоматично оновлює сайт.

## Локальний перегляд

Файл можна відкрити напряму в браузері, але для коректної роботи `fetch("data/works.json")`
краще запустити локальний сервер, наприклад:

```
npx serve .
```

або через Python:

```
python -m http.server 5500
```
