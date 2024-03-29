import Vue from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faFeatherAlt,
  faTimes,
  faPencilAlt,
  faUser,
  faBook,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

library.add([
  faFeatherAlt,
  faTimes,
  faPencilAlt,
  faUser,
  faBook,
  faSignInAlt,
  faSignOutAlt,
]);

Vue.component("FaIcon", FontAwesomeIcon);
