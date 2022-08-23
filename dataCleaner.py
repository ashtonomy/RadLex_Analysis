import pandas as pd

data = pd.read_csv("radlex_id_parent_label.csv")

#urlDict = dict(zip(data["Class ID"], data["Preferred Label"]))

#newData = data.replace({"Parents": nameDict})

#newData.drop(labels="Class ID", axis=1, inplace=True)

#newData.rename(columns={'Parents': 'parentId', 'Preferred Label': 'id'}, inplace=True)

#newData = newData[["id", "parentId"]]

#dups = newData[newData.duplicated(subset="id",keep=False)]
#
#dups = dups.sort_values(by="id")
#
#pd.set_option('display.max_rows', None)
#pd.set_option('display.max_colwidth', 100)
#print(dups.head(100))

#newData.to_csv("radlex_hierarchy.csv", index=False)

# Add URL column back to csv, after reformatting
# I am aware how ugly this is.
# Hindsight is 20/20.

hierarchy = pd.read_csv("radlex_hierarchy.csv")

# Remove Obsolete RID labels. What a beaut.
hierarchy = hierarchy[~( 
	(hierarchy["id"].str.startswith("RID")) & 
	(~hierarchy["id"].isin(hierarchy["parentId"]))
)]


defs = pd.read_csv("id_def.csv")
defDict = dict(zip(defs["id"], defs["definition"]))

urlDict = dict(zip(data["Preferred Label"], data["Class ID"]))
parents = set(hierarchy["parentId"])

# Update URL format and remove multiple links

tok1 = '|'
for key in list(urlDict):
	if tok1 in urlDict[key]:
		newVal = urlDict[key].split(tok1)[0]
		if newVal.startswith("http"):
			urlDict[key] = newVal
		else:
			urlDict[key] = "http://www.radlex.org"
			

tok2 = '#'
for key in urlDict:
	if tok2 in urlDict[key]:
		newVals = urlDict[key].split(tok2)
		urlDict[key] = newVals[0] + newVals[1]

hierarchy["url"] = hierarchy["id"].map(urlDict)
hierarchy["definition"] = hierarchy["id"].map(defDict)

hierarchy.to_csv("radlex_hierarchy_w_links.csv", index=False)