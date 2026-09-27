// Charge l'environnement des scripts CLI, avant qu'ils ne s'exécutent.
//
// Pourquoi ce fichier existe
// --------------------------
// Les scripts utilisaient `tsx --env-file-if-exists=.env --env-file-if-exists=.env.local`.
// Ce drapeau n'existe pas sur toutes les versions de Node que le projet
// accepte (`engines: node >= 20`) : sur Node 20.18 il est refusé — « bad
// option » — et `pnpm db:make-superadmin`, `pnpm seed:dev`, `pnpm smoke:auth`
// et `pnpm db:reprise-caisse` échouaient tous avant même de démarrer, sur un
// message qui ne dit rien de la cause : « node: .env.local: not found ».
//
// `process.loadEnvFile` (Node >= 20.6) fait le même travail depuis le code, et
// il est présent partout où le projet tourne. Chargé via `--import`, il
// s'exécute avant le script : celui-ci n'a rien à savoir de tout ça, et les
// tests qui importent ces modules ne sont pas touchés.
//
// Ordre : `.env.local` d'abord
// ----------------------------
// `loadEnvFile` n'écrase jamais une variable déjà posée — vérifié. Le premier
// fichier lu l'emporte donc, et une variable venue du shell gagne sur les deux.
// Charger `.env.local` en premier lui donne la priorité sur `.env`, ce qui est
// la convention de Next.js : le développeur y met ses valeurs locales sans
// toucher au fichier partagé.

import { existsSync } from 'node:fs';

for (const fichier of ['.env.local', '.env']) {
  if (existsSync(fichier)) process.loadEnvFile(fichier);
}
