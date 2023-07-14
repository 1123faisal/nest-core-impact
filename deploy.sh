set -v
set -e
set -x

echo "enter msg"
read msg

cd panels
ng b admin --base-href="/admin-panel/"
ng b coach --base-href="/coach-panel/"
ng b org --base-href="/org-panel/"

git add .
git commit -m "$msg" || true
git push || true

cd ..

cd backend-apis
nest build

git add .
git commit -m "$msg" || true
git push || true

cd ..

rsync -av --exclude='node_modules/' --exclude='.vscode/' --exclude='.angular/' --exclude='core_Impact_admin_theme/' --exclude='.git/' --exclude='dist/' --include='.*' ./ /home/faisal/Projects/shalesh_projects/core-impact-project/copy

cd /home/faisal/Projects/shalesh_projects/core-impact-project/copy

git add .
git commit -m "$msg" || true
git push || true

cd -

cd /home/faisal/Projects

ssh -i Fetch-delivery.pem ubuntu@44.195.125.80 <<EOF
    cd /var/www/html/coreimpact3 && git pull && npm i --omit=dev && pm2 reload coreimpact
    exit
EOF

cd -
