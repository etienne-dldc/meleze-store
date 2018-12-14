import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import { WindowSize } from './state';
import createUuid from 'uuid/v4';
import throttle from 'utils/throttle';
export { execute } from '../lib';

const applicationID = 'Y22I53GFTP';
const apiKey = 'b1a057e32b6b56d9b492373173f86b33';
const indexName = 'questions';

function createAlgoliaEffect() {
  let client: algoliasearch.Client | null = null;
  let helper: algoliasearchHelper.AlgoliaSearchHelper<any> | null = null;
  let initialized: boolean = false;
  let answersIndex: algoliasearch.Index;

  const answerCache: Map<string, any> = new Map();

  function init() {
    if (initialized) {
      return;
    }
    client = algoliasearch(applicationID, apiKey);
    answersIndex = client.initIndex('answers');
    helper = algoliasearchHelper(client, indexName);
    initialized = true;
  }

  async function search(query: string) {
    if (initialized === false || helper === null) {
      throw new Error('Algolia is not initialized yet');
    }
    const result = await helper.searchOnce({
      query,
    });
    return result.content;
  }

  function getAnswer(id: string): Promise<any> {
    if (!answerCache.has(id)) {
      const result = new Promise((resolve, reject) => {
        answersIndex.getObject(id, (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        });
      });
      result.then(res => {
        answerCache.set(id, res);
      });
      answerCache.set(id, result);
    }
    return Promise.resolve(answerCache.get(id));
  }

  return {
    init,
    search,
    getAnswer,
  };
}

export const algolia = createAlgoliaEffect();

export function syncWindowSize(onResize: (newSize: WindowSize) => void) {
  window.addEventListener(
    'resize',
    throttle(() => {
      onResize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 1000 / 60)
  );
  // init
  onResize({
    height: window.innerHeight,
    width: window.innerWidth,
  });
}

export const uuid = createUuid;
