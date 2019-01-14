import { FramentsManager } from '../lib';
import { State, state as rawState } from './state';
import { notNill } from './utils';

const manager = new FramentsManager<State>(rawState);

const post = manager.fragment('post', (state, postId: string) => {
  return notNill(state.posts.find(p => p.id === postId));
});

const selectedPost = manager.fragment('selectedPost', state => post(state.selectedPostId));

const selectedPostComments = manager.fragment('selectedPostComments', state => {
  return selectedPost().comments.map(commentId => {
    return notNill(state.comments.find(comment => comment.id === commentId));
  });
});

const somePosts = manager.fragment('somePosts', () => ({
  first: post('1'),
  second: post('2'),
  third: post('3').title,
}));

const combined = manager.fragment('combined', (state, input: { first: string; second: string }) => {
  const result = {
    selected: selectedPostComments(),
    selectedBis: selectedPostComments(),
    keys: Object.keys(state),
    somePosts: somePosts(),
    thePost: post(input.first),
    theSecondPost: post(input.second),
  };
  return result;
});

const selectedFromCombined = manager.fragment('selectedFromCombined', () => {
  return combined({ first: '1', second: '2' }).selected;
});

const someString = manager.fragment('someString', () => {
  const selected = selectedFromCombined();
  if (selected.length === 0) {
    return 'yolo';
  }
  return selected[0].id + combined({ first: '1', second: '2' }).keys[0];
});

const resolveStuff = manager.createResolve('resolveStuff', combined);
const resolveSomeStr = manager.createResolve('resolveSomeStr', someString);

// const result = resolveStuff({ first: '6', second: '7' });

// console.log(result);
console.log(resolveStuff({ first: '6', second: '7' }));
console.log(resolveSomeStr());

console.log('===========');

console.log(resolveStuff({ first: '5', second: '6' }));
console.log(resolveSomeStr());

manager.mutate(state => {
  state.posts.push({
    title: 'Yolo',
    id: 'new',
    comments: [],
    likes: 0,
  });
});

console.log(manager);
