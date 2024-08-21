# Mung-Shu Shen
# 2024/08/20

if [ "$#" -ne 8 ]; then
    echo ""
    echo "usage: bash swissdock.sh ligand-type ligand-input target exhaust cavity ric boxcenter boxsize"
    echo ""
    echo "Ligand input type: smiles | mol2 | ac"
    echo ""
    echo "  smiles: smiles sequence in single quotes"
    echo ""
    echo "  mol2: mol2 file path"
    echo ""
    echo "  ac: tar file path"
    echo "      tar file contains:"
    echo "          - parameter file (.par)"
    echo "          - coordinate file (.cif, .ent, .pdb)"
    echo "          - residue topology file (.rft)"
    echo "      command to tar files: tar -zcf ligand.tar.gz -C path-to-folder"
    echo ""
    echo "Target input types: " 
    echo ""
    echo "  coord: coordinate file path (.cif, .ent, .pdb)"
    echo ""
    echo "  pretar: tar file path"
    echo "      tar file contains:"
    echo "          - coordinate file (.cif, .ent, .pdb)"
    echo "          - protein structure file (.psf)"
    echo "      command to tar files: tar -zcf target.tar.gz -C path-to-folder"
    echo ""
    echo "Exhaust (integer): sampling exhaustivity used for the ligand positioning defined by the rotational step value in degrees"
    echo "  use - to use default (90)"
    echo ""
    echo "Cavity (integer): cavity prioritization"
    echo "  use - to use default (70)"
    echo "" 
    echo "Ric (integer): number of random inital conditions"
    echo "  use - to use default (2)" 
    echo "" 
    echo "Boxcenter (float): -REQUIRED- center of the box"
    echo "  use _ to seperate values (x_y_z)"
    echo ""
    echo "Boxsize (float): size of the box"
    echo "  use - to use default (20.0_20.0_20.0)"
    echo "  use _ to seperate values (x_y_z)"
    echo ""
    echo "usage: bash swissdock.sh ligand-type ligand-input target exhaust cavity ric boxcenter boxsize"
    echo ""
    exit 1
fi
default="-"
lig_type="$1"
ligand="$2"
target="$3"
exhaust="$4"
cavity="$5"
ric="$6"
boxcenter="$7"
boxsize="$8"


if [[ "$exhaust" == "-" ]]; then
    exhaust=90 
fi

if [[ "$cavity" == "-" ]]; then
    cavity=70
fi

if [[ "$ric" == "-" ]]; then
    ric=2
fi 

if [[ "$boxsize" == "-" ]]; then    
    boxsize="20_20_20"
fi

echo ""

server=$(curl "https://swissdock.ch:8443/" | xargs)

if [[ "$server" != "Hello World!" ]]; then
    echo "Server not up"
    exit 1
fi

echo ""

if [[ "$lig_type" == "smiles" ]]; then
    session=$(curl -g "https://swissdock.ch:8443/preplig?mySMILES=$ligand")
else
    session=$(curl -F "myLig=@$ligand" "https://swissdock.ch:8443/preplig")
fi
session_number=$(echo $session | grep -oP 'Session number: \K[0-9]+')


echo ""

upload_target=$(curl -F "myTarget=@$target" "https://swissdock.ch:8443/preptarget?sessionNumber=$session_number")

upload_target_session_number=$(echo $upload_target | grep -oP 'Using session number: \K[0-9]+')

if [[ "$session_number" != "$upload_target_session_number" ]]; then 
    echo "something wrong"
    exit 1  
fi

echo ""

params=$(curl "https://swissdock.ch:8443/setparameters?sessionNumber=$session_number&exhaust=$exhaust&cavity=$cavity&ric=$ric&boxCenter=$boxcenter&boxSize=$boxsize")

echo ""

startjob=$(curl "https://swissdock.ch:8443/startdock?sessionNumber=$session_number")

started=$(echo $startjob | grep -c ERROR)

if [[ "$started" == 1 ]]; then
    echo "ERROR: check parameters"
    echo ""
    exit 1
fi

echo "$startjob"
echo ""

while [ 1 ]
do
    status=$(curl "https://swissdock.ch:8443/checkstatus?sessionNumber=$session_number")
    finished=$( echo $status | grep -c finished)

    echo "$status"
    echo "$session_number"
    echo ""
    if [[ "$finished" == 0 ]]; then 
        sleep 60
    else    
        break
    fi
done

curl "https://swissdock.ch:8443/retrievesession?sessionNumber=21956998" -o results.tar.gz 