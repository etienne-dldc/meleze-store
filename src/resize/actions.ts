import { pipe } from './operators';
import { StateImage } from './state';
import * as mutations from './mutations';
import * as operations from './operations';

export const addImages = pipe(
  operations.mapFileToStateImage,
  mutations.addImages
);

export const processAndDowloadZip = pipe(
  mutations.setRunning,
  operations.dowloadZip,
  mutations.setNotRunning
);

export const handleWatermarkCheckbox = pipe(
  operations.extractChecked,
  mutations.setWatermarkEnabled
);

export const handleWatermarkText = pipe(
  operations.extractValue,
  mutations.setWatermarkText
);

export const {
  setSettingType,
  setSettingMaxSize,
  setSettingQuality,
  toggleExpandItem,
  setWaterMarkOpacity,
  setWaterMarkSize,
  removeImage,
} = mutations;
