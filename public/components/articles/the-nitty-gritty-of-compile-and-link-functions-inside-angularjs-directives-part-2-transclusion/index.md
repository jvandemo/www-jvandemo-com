Transclusion.

A mysterious word I had never heard of before until I met AngularJS. I seriously thought [Misko Hevery](https://twitter.com/mhevery) had invented the word himself, but it appeared to be an existing word:

> In computer science, transclusion is the inclusion of a document or part of a document into another document by reference ([Wikepedia](http://en.wikipedia.org/wiki/Transclusion)).

In AngularJS, transclusion is the mechanism that allows you to grab the content of the DOM element of your directive and include it anywhere in the directive's template.

So in the context of AngularJS, we could rephrase the original definition as:

> In AngularJS, transclusion is the inclusion of the directive's DOM element content into the directive's template

In this article we investigate the influence of transclusion on the `compile`, `pre-link` and `post-link` functions inside an AngularJS directive.

*This article is a follow-up article on ["The nitty-gritty of compile and link functions inside AngularJS directives"](/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives)*.

## The code

Because this article is an extension to [part 1](/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives), we will use the same code we already discussed previously.

Consider the following HTML markup:

```markup
<level-one>
	<level-two>
		<level-three>
			Hello {{name}}         
		</level-three>
	</level-two>
</level-one>
```

and the following JavaScript:

```javascript
var app = angular.module('plunker', []);

function createDirective(name){
  return function(){
    return {
      restrict: 'E',
      compile: function(tElem, tAttrs){
        console.log(name + ': compile');
        return {
          pre: function(scope, iElem, iAttrs){
            console.log(name + ': pre link');
          },
          post: function(scope, iElem, iAttrs){
            console.log(name + ': post link');
          }
        }
      }
    }
  }
}

app.directive('levelOne', createDirective('levelOne'));
app.directive('levelTwo', createDirective('levelTwo'));
app.directive('levelThree', createDirective('levelThree'));
```

providing the following console output:

![](/components/articles/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives-part-2-transclusion/img/example-1.png)

which can be summarized as:

```javascript
// COMPILE PHASE
// levelOne:    compile function is called
// levelTwo:    compile function is called
// levelThree:  compile function is called

// PRE-LINK PHASE
// levelOne:    pre link function is called
// levelTwo:    pre link function is called
// levelThree:  pre link function is called

// POST-LINK PHASE (Notice the reverse order)
// levelThree:  post link function is called
// levelTwo:    post link function is called
// levelOne:    post link function is called
```

and visualized as:

![No transclusion](/components/articles/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives-part-2-transclusion/img/no-transclusion-1.svg)

To try it out for yourself, just open [this plnkr](http://plnkr.co/edit/5rbeFfKO7QUM2PGkK3Qy?p=preview) and take a look at the console.

> This is all explained in [part 1](/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives) so make sure to read it first if you are interested in learning more about how directives without transclusion work.

## So let's add transclusion

Transclusion is enabled by adding a `transclude` property to the directive definition object:

```javascript
var app = angular.module('plunker', []);

function createDirective(name){
  return function(){
    return {
      restrict: 'E',
      transclude: true,
      compile: function(tElem, tAttrs){
        console.log(name + ': compile');
        return {
          pre: function(scope, iElem, iAttrs){
            console.log(name + ': pre link');
          },
          post: function(scope, iElem, iAttrs){
            console.log(name + ': post link');
          }
        }
      }
    }
  }
}

app.directive('levelOne', createDirective('levelOne'));
app.directive('levelTwo', createDirective('levelTwo'));
app.directive('levelThree', createDirective('levelThree'));
```

Adding `transclude: true` tells AngularJS to capture the content of the directive and make it available in the directive's template. The `ng-transclude` attribute can then be used inside the template to specify where you want AngularJS to restore the content.

But before we add the `ng-transclude` attribute to template, let's have a look at what we get so far:

![](/components/articles/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives-part-2-transclusion/img/translude-true.png)

To try it out for yourself, just open [this plnkr](http://plnkr.co/edit/mJZpuesd3sFtvhMr1MRI?p=preview) and take a look at the console.

## Interesting

First of all notice how the order of the `compile` functions is reversed:

```javascript
// COMPILE PHASE (Notice the reverse order)
// levelThree:  compile function is called
// levelTwo:    compile function is called
// levelOne:    compile function is called

// PRE-LINK PHASE
// levelOne:    pre link function is called

// POST-LINK PHASE
// levelOne:    post link function is called
```

and even though we haven't transcluded the actual content yet using `ng-transclude`, all `compile` functions are called:

![](/components/articles/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives-part-2-transclusion/img/transclusion.svg)

## So what is happening?

When AngularJS processes the `levelOne` directive, it sees that the `transclude` property is set to `true` in the definition object.

AngularJS now knows it first needs to process the content of the directive's element before it can make the processed content available inside the template.

To accomplish that, AngularJS first needs to process all child elements. So it starts travelling down the element's DOM.

When processing `levelOne`'s content, it encounters the `levelTwo` directive and recursively repeats the same process until it has no more child elements to process.

As soon as the complete child DOM has been processed, AngularJS is ready to start applying the directives' `compile`, `post-link` and `pre-link` functions.

Since we haven't specified an `ng-transclude` attribute yet, the processed content is never put back into the DOM and we end up with a *black hole* where all child elements of `levelOne` disappear.

This is rarely useful in real situations, but for the purpose of experimentation it demonstrates how all compile functions are called, even if the content is not effectively transcluded.

## Now let's add ng-transclude

To get a complete picture of what's happening, let's add a `template` property to our directive definition object with a string value of `<div ng-transclude></div>` to tell AngularJS where to put the transcluded content:

```javascript
var app = angular.module('plunker', []);

function createDirective(name){
  return function(){
    return {
      restrict: 'E',
      transclude: true,
      template: '<div ng-transclude></div>',
      compile: function(tElem, tAttrs){
        console.log(name + ': compile');
        return {
          pre: function(scope, iElem, iAttrs){
            console.log(name + ': pre link');
          },
          post: function(scope, iElem, iAttrs){
            console.log(name + ': post link');
          }
        }
      }
    }
  }
}

app.directive('levelOne', createDirective('levelOne'));
app.directive('levelTwo', createDirective('levelTwo'));
app.directive('levelThree', createDirective('levelThree'));
```

and check the output again:

![](/components/articles/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives-part-2-transclusion/img/transclude-and-template.png)

To try it out for yourself, just open [this plnkr](http://plnkr.co/edit/mJZpuesd3sFtvhMr1MRI?p=preview) and take a look at the console.

## Let's analyze further

If we summarize the output:

```javascript
// COMPILE PHASE (Notice the reverse order)
// levelThree:  compile function is called
// levelTwo:    compile function is called
// levelOne:    compile function is called

// PRE-LINK PHASE
// levelOne:    pre link function is called
// levelTwo:    pre link function is called
// levelThree:  pre link function is called

// POST-LINK PHASE (Notice the reverse order)
// levelThree:  post link function is called
// levelTwo:    post link function is called
// levelOne:    post link function is called
```

we can see that transclusion appears to reverse the order in which the `compile` functions are called.

Let's compare the difference visually:

### Without transclusion

![No transclusion](/components/articles/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives-part-2-transclusion/img/no-transclusion-1.svg)

### With transclusion

![](/components/articles/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives-part-2-transclusion/img/transclusion-2.svg)

So why is transclusion reversing the order in which the `compile` functions are called?

If we look back at the initial output and how we defined transclusion earlier:

> In AngularJS, transclusion is the inclusion of the directive's DOM element content into the directive's template

then we can quickly deduce that AngularJS needs to process the element's DOM content before it can make it available inside the template.

**However, the element's child elements can also contain directives that apply transclusion themselves.**

So AngularJS has to recursively traverse the DOM first to check if transclusion is enabled in child elements and then compile the DOM backwards to make sure all DOM changes correctly *"bubble up"* again to the top before the processed DOM is ready to be added to the original directive's template.

The initial *black hole* that we created before we included the `ng-transclude` attribute is a perfect example of this.

Finally, when compilation has finished, the `pre-link` and `post-link` functions are called in the same way as explained in [part 1](/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives).

## Conclusion

By now you should hopefully have a better understanding of how transclusion affects the `compile`, `pre-link` and `post-link` functions in directives and why it reverses the order in which the `compile` functions are called.

If you are still in doubt or have additional questions, please feel free to leave a comment below.

Because of the overwhelming number of questions I have received since the last article, I will also publish follow-up articles on:

- how this relates to the `controller` function of a directive
- how this is affected by using a `template` or `templateUrl`
- how this is affected by directive `priority`

If you want me to notify you when new follow-up articles are available, please leave your email address below (don't worry, I don't send spam).

Have a great one!

### Note

Although it's outside the scope of this article (no pun intended), it is worth mentioning that transclusion also has an important impact on the `scope` that is linked to the element (cf. [official AngularJS directive page](https://docs.angularjs.org/guide/directive)).
