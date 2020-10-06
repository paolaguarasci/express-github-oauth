# Cosa posso fare da utente loggato (tramite API)

https://docs.github.com/en/free-pro-team@latest/developers/apps/differences-between-github-apps-and-oauth-apps

You can use this API to manage the access OAuth applications have to your account. You can only access this API via [Basic Authentication](https://docs.github.com/en/free-pro-team@latest/rest/overview/other-authentication-methods#basic-authentication) using your username and password, not tokens.

https://docs.github.com/en/free-pro-team@latest/developers/apps/scopes-for-oauth-apps

Esiste una differenza tra git apps e oauth app...

Le oauth app hanno uno scopo come anche i personal token.

La differenza è che il personal token lo decide l'utente mentre l'oauth app "chiede" e se non vuoi accordarglieli IN TOTO non ti funziona niente.

----

### Lista repository

Se mi serve la lista di repository PUBBLICI posso accedere **senza** nessun tipo di autorizzazione, liberamente, ad un endpoint del tipo:

https://api.github.com/users/USERNAME/repos

Se mi serve invece la lista di tutti i repository di quel particolare utente, verosimilmente l'utente loggato, allora l'endpoint sarà: 

https://api.github.com/users/repos

e devo usare uno dei tanti metodi di autenticazione che ho a disposizione. Noi usiamo OAuth. In questo caso si parla di *installazione* perché durante la prima richiesta di autenticazione l'utente autorizza la nostra app con una serie di *scopes* che rimangono i medesimi per ogni successiva richiesta.

 