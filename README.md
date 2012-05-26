github-codereview
=================

**A dotjs-based solution for improving code-reviews on pull requests.**

This will add ``next commit``, ``previous commit``, ``back to pull request`` links to the site if you're reviewing a pull request. 

Basically, if you visit the overview of the pull request, it will add an array of all commit hashes to all links that point to single commits. If you follow one of the links, it will obtain the next and previous commit hashes from this array. It's not very elegant, but it does the job ;)   

How to install
=================

1. Install [dotjs](https://github.com/defunkt/dotjs)
2. copy the ``github.com.js`` file to your ``~/.js`` folder
3. enjoy
