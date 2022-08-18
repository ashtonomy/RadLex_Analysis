require(devtools)
install_github("lchiffon/wordcloud2")
library(wordcloud2)
library(viridis)

dirPath <- file.path("C:", "Users", "tasht", "Documents", "Clemson",
                     "npl_project", "supplementary_projects",
                     "radlex_analysis")

wordFile <-file.path(dirPath, "top100WordCount.txt")

wordData <- read.csv(wordFile, header=FALSE)

colnames(wordData) <- c("word", "freq")

#head(wordData)

colorVec <- viridis(nrow(shuffledWords))
set.seed(8182022)
shuffledColorVec <- sample(colorVec)

p <- wordcloud2(wordData, minRotation = 0, maxRotation = 0, color = shuffledColorVec, fontFamily = "helvetica")
p
