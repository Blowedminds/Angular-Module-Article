# Angular-Module-Article

This module helps you to manage the site articles.

**Required Packages**
*--no required packages--*

**Required Modules**
1. fmblog-frontend-navigation
2. fmblog-frontend-shared
3. Angular-Module-Core
4. Angular-Module-Image

**Functionalities**
1. Add, Update, Move to Trash, Delete article
2. Support multilingual article.
3. Manage article permission, which user can edit.

**Installation**
1. Add the module to Angular Project as a submodule. 
`git submodule add https://github.com/bwqr/Angular-Module-Article src/app/article`
2. Import `ArticleModule` from inside `AppModule`.
3. Add following routes to `src/app/routes.ts`  
`   
article: {
    url: 'article/',
    article: { url: 'article/' },
    content: { url: 'content/' },
    restore: { url: 'restore/' },
    'force-delete': { url: 'force-delete/' },
    permission: { url: 'permission/' },
    articles: { url: 'articles/' },
    trash: { url: 'trashed-articles/' },
}
`