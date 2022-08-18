# RadLex_Analysis
[RadLex](http://radlex.org/) is an ontology produced by RNSA focused on the domain of radiology. The goal of this project was to better understand the data contained within the ontology. 

## RadLex Word Frequency and Co-Occurrence
The first step in the process was determining the relative frequency of words in the RadLex "Preferred Labels" which was accomplished using NLP++. The preferred labels from the RadLex excel file were converted to a text file which was used as input for the NLP++ analyzer. Each unique word and its count was stored in a knowledge base and sorted by frequency. The [most common English words](https://en.wikipedia.org/wiki/Most_common_words_in_English) were then filtered out and the remaining top 100 words were output to "top100WordCount.txt". 

![Word Count](radlexWordCloud.png)
[Interactive Word Cloud](https://ashtonomy.github.io/RadLex_Analysis/radlexWordCloud.html)

The next goal was to see how these words were associated in the text. I aimed to represent the information as a graph in which each vertex corresponded to a word in the top 100 list and each edge corresponded to occurence in the same preferred label. Edge weights would then be assigned an integer count of co-occurences in preferred labels[^1]. 

To achieve this, each of the top 100 words was mapped to an integer value corresponding to its index in the alphabetically sorted top 100 words list. Using NLP++, the text file of preferred labels was filtered to include only labels including two or more of the top 100 words; furthermore, all words not in the top 100 were excised. A text file was output to "indexList.txt" containing each label on a separate line, with each word replaced with its integer index. Python was used to create an adjacency matrix from this text file, using the numpy library to export the matrix to "adjacencyMatrix.txt". 

Finally, to visualize the data, I created a simple interactive chord diagram in R using the [ChordDiag package](https://github.com/mattflor/chorddiag).

### [View Interactive Diagram](https://ashtonomy.github.io/RadLex_Analysis/radlex_interactive.html)

[^1]: N.B. I chose to ignore order and proximity of word co-occurrences as well as co-occurrences of the same word, resulting in an undirected, acyclic graph. This may be interesting to revisit in the future.
