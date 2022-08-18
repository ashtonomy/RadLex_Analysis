library(igraph)
library(circlize)
library(chorddiag)
library(viridis)
library(htmlwidgets)

#Specify file paths here

matrixFile <- file.path("C:", "Users", "tasht", "Documents", "Clemson",
                        "npl_project", "supplementary_projects",
                        "adjacencyMatrix.txt")

namesFile <- file.path("C:", "Users", "tasht", "Documents", "Clemson",
                       "npl_project", "supplementary_projects",
                       "topWords.csv")

# RadLex Adjacency Matrix of Top 100 Words

adjMatrix <- as.matrix(read.table(matrixFile, sep=" "))

#Sets field names from newline separated csv list

fieldNames <- readLines(namesFile)

colnames(adjMatrix) = fieldNames

rownames(adjMatrix) = fieldNames


###############################################################################

# Create and plot a network object

#network <- graph_from_adjacency_matrix(adjMatrix)

#plot(network)

###############################################################################

# Create a Basic Chord Diagram

# Set colors to viridis scale
#grid.col <- setNames(viridis(length(unlist(rownames(adjMatrix)))), rownames(adjMatrix))
#par(mar = c(0,0,0,0), mfrow = c(1,1))

# chordDiagram(adjMatrix, symmetric = TRUE, annotationTrack = "grid", preAllocateTracks = 1, grid.col = grid.col)
# circos.trackPlotRegion(track.index = 1, panel.fun = function(x,y) {
#   xlim = get.cell.meta.data("xlim")
#   ylim = get.cell.meta.data("ylim")
#   sector.name = get.cell.meta.data("sector.index")
#   circos.text(mean(xlim), ylim[1] + .1, sector.name, facing = "clockwise", niceFacing = TRUE, adj = c(0, 0.5))
#   circos.axis(h = "top", labels.cex = 0.5, major.tick.percentage = 0.2, sector.index = sector.name, track.index = 2)
# }, bg.border = NA)

###############################################################################

# Create an Interactive Chord Diagram

#Create list of colors in viridis scale for each row label
groupColors <- viridis(length(unlist(rownames(adjMatrix))))

p <- chorddiag(adjMatrix, groupColors=groupColors, groupnamePadding=30, groupPadding=2, tickInterval = 1000, ticklabelFontsize=8, fadeLevel = 0.05, chordedgeColor = NULL)
p

#Save html widget

widgetFile <- file.path("/Clemson",
                        "npl_project", "supplementary_projects",
                        "radlex_analysis", "radlex_interactive.html")

saveWidget(p, file=paste0( getwd(), widgetFile))


