---
	title: Introduction to D3 Scales
	date: 2016-10-29
	dateLabel: October 2016
	description: Intro to D3 scales
	collection: posts
---

Data visualization is all about transformation. At the highest level, the goal is to transform a heap of raw data into actionable insights and understanding. At a more granular, fundamental level, you must transform abstract data into visual representations. Test scores become column heights measured in pixels, national populations become circle radii, and on and on.

In D3 these transformations are done with scales. There are many types of scales, suited for many different purposes and types of data, but the one to start with   is the linear scale. A linear scale is exactly what it sounds like; a function for creating a direct mapping from one set of values to another.

## Anatomy of a scale

Every scale in D3 has two parts: a domain and a range.

A scale's domain describes the set of possible input values to the scale. Now, most times you couldn't realistically list every possible input value, so the domain is described using an array. For example, in a linear scale you can specify that input values will fall between 0 and 100 by providing the array `[0, 100]`. If we were visualizing test scores this would likely be a perfect domain.

A scale's range, on the other hand, describes the set of possible output values that the input values can be converted to. If we're building a bar chart to display our test scores, we'd want our range to describe the minimum and maximum bar sizes. If we know our chart will be 500 pixels wide, we could set our range to the array `[0, 500]`.

Here's what all of this looks like in D3 code.

```javascript
const linearScale = d3.scaleLinear()
	.domain([0, 100])
	.range([0, 500]);
```

That code will return a linear scale function. We can pass in values from our input domain and the function will return values from our output range.

```javascript
linearScale(0); // 0
linearScale(50); // 250
linearScale(100); // 500
```

That's it! We construct our scale using D3's standard API, and we get back a useful, pure function. Scales are one of the fundamental pillars of data visualization generally, and D3 specifically.

## What about outliers?

In the scale we created above, we said that all of our input values would fall between 0 and 100. That's a pretty safe bet when dealing with test scores, but what if there was an extra credit question? Maybe little Alice Einstein in the front row managed to score 105, and she's messing up our scale!

Don't worry, D3 has you covered. Out of the box, the value would be converted normally, and would fall outside the bounds we provided as our range. Given our scale definition from above, `linearScale(105)` would return `525`.

Depending on how your visualization is built, that might be just fine. But what if it's not? What if you really only have 500 pixels of space, and a bar that is 525 pixels wide is wrecking your layout? If that's the case you'll want to enable clamping on your scale.

```javascript
const linearScale = d3.scaleLinear()
	.domain([0, 100])
	.range([0, 500])
	.clamp(true);
```

With this updated version of our scale, `linearScale(105)` would return `500`, avoiding any problems with layout. Passing `true` to the `clamp` method does exactly what you'd expect and prevents your scale function from returning any values outside the range you specified. This works on both ends of the scale, so `linearScale(-10)` would still return `0` as well.

## That's basically it

Not too bad, right? There are many more scale types in D3 (and you can roll your own!) but they all follow this same basic formula. You pick a scale type, define what type of data will go in and what should come out, and in return you get a function that will convert values in the manner you specified.

Once you understand these fundamental building blocks you are well on your way to being productive with D3. I've embedded an example below that defines a linear scale like we defined above. Experiment with different values in the domain and range, and see if you can anticipate the values the scale function will produce!

<iframe width="100%" height="500px" frameborder="0" style="margin-bottom: 2em" src="https://embed.plnkr.co/github/bclinkinbeard/egghead-d3v4/02-linear-scales?show=src%2Fapp.js,preview&autoCloseSidebar=true"></iframe>
