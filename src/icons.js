import Vue from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import {
    faFeatherAlt
} from '@fortawesome/free-solid-svg-icons';

library.add([
    faFeatherAlt
]);

Vue.component('FaIcon', FontAwesomeIcon);
