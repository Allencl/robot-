/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import '@wis_component/http';
// import { LogBox,} from 'react-native';

// LogBox.ignoreAllLogs('');
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
