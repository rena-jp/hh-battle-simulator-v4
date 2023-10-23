import style from './style.css';
import { addStyle } from './utils/style';
import { main } from './main';

(() => {
    addStyle(style);
    main();
})();
