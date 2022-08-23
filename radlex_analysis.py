ENTRIES = 100
ROWS 	= ENTRIES
COLS 	= ENTRIES
INPUT 	= "indexList.txt"
OUTPUT 	= "adjacencyMatrix.txt"

import numpy as np

adjArray = [ [ 0 for n in range( ROWS ) ] 
				  for m in range( COLS )]

# Altered to create digraph
with open(INPUT, 'r') as inFile:
	for line in inFile.readlines():
		indices = list(map(int, line.split()))
		for counti, i in enumerate(indices):
			for countj, j in enumerate(indices[counti + 1:], counti+1):
				if i != j:
					adjArray[i][j] += 1		



adjMatrix = np.matrix(adjArray)
np.savetxt(OUTPUT, adjMatrix, fmt='%d')
