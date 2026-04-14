# Manual rename instructions

Close all programs that may lock folders:
1. Stop dev server (Ctrl+C)
2. Close VS Code
3. Close Explorer windows with `public` folder open
4. Or restart computer

Then rename these folders manually in Explorer:

## Top-level catalog folders:
```
catalog/1.ØÑÇÐ¾ÑÑ Ð¸ ÑÇÐºÐ°Ð½Ð¸  -> catalog/1.shtory-i-tkani
catalog/2.ÐÐ°Ð»ÑÐ·Ð¸           -> catalog/2.zhalyuzi
catalog/3.Ð Ð¸Ð¼ÑÐºÐ¸Ðµ         -> catalog/3.rimskie
catalog/4.ÐÐ°ÑÐ½Ð¸Ð·Ñ          -> catalog/4.karnizy
```

## Subfolders in catalog/4.ÐÐ°ÑÐ½Ð¸Ð·Ñ:
```
ÐÐ°ÑÑÐ½Ð½ÑÐµ ÐºÐ°ÑÐ½Ð¸Ð·Ñ     -> latunnye-karnizy
ÐÐµÑÐ°Ð»Ð»Ð¸ÑÐµÑÐºÐ¸Ðµ ÐºÐ°ÑÐ½Ð¸Ð·Ñ -> metallicheskie-karnizy
ÐÑÐ¾ÑÐ¸Ð»ÑÐ½ÑÐµ ÐºÐ°ÑÐ½Ð¸Ð·Ñ    -> profilnye-karnizy
ÐÐ»ÐµÐºÑÑÐ¾ÐºÐ°ÑÐ½Ð¸Ð·Ñ       -> elektrokarnizy
```

## Other folders:
```
Ð¥ÑÐ¾Ð½Ð¾Ð»Ð¾Ð³Ð¸Ñ             -> hronologiya
Ð¤Ð¾ÑÐ¾ Ð´Ð»Ñ Ð½Ð¾Ð²Ð¾Ð³Ð¾ ÑÐ°Ð¹ÑÐ° -> foto-dlya-novogo-sayta
```

After renaming, run:
```
node front/scripts/rename-execute.js
```

Then update MongoDB:
```
node front/scripts/update-mongo-paths.js
```
