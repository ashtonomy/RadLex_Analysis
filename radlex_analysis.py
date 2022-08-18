ENTRIES = 100
ROWS 	= ENTRIES
COLS 	= ENTRIES
INPUT 	= "indexList.txt"
OUTPUT 	= "adjacencyMatrix.txt"

import numpy as np

adjArray = [ [ 0 for n in range( ROWS ) ] 
				  for m in range( COLS )]

with open(INPUT, 'r') as inFile:
	for line in inFile.readlines():
		indices = map(int, line.split())
		for i in indices:
			for j in indices:
				if i != j:
					adjArray[i][j] += 1
					adjArray[j][i] += 1



adjMatrix = np.matrix(adjArray)
np.savetxt(OUTPUT, adjMatrix, fmt='%d')
