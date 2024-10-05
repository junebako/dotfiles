if status is-interactive
    # Commands to run in interactive sessions can go here
end

set PATH /opt/homebrew/bin $PATH

function history-merge --on-event fish_preexec
  history --save
  history --merge
end

function gfpr
    set branch

    if git branch -a --format="%(refname:short)" | grep -q '^develop$'
        set branch develop
    else if git branch -a --format="%(refname:short)" | grep -q '^main$'
        set branch main
    else
        set branch master
    end

    git checkout $branch
    git fetch origin
    git pull --rebase origin $branch
end

function gmbd
    set branch

    if git branch -a --format="%(refname:short)" | grep -q '^develop$'
        set branch develop
    else if git branch -a --format="%(refname:short)" | grep -q '^main$'
        set branch main
    else
        set branch master
    end

    git branch --merged $branch | grep -vE "^\*|$branch\$" | xargs -I % git branch -d %
end

function rmcache
    if test (count $argv) -eq 0
        echo "Usage: rmcache <path>"
        return 1
    end

    set path $argv[1]

    # Find and list .DS_Store files
    echo "Listing .DS_Store files in $path:"
    find $path -name ".DS_Store"

    echo

    # Remove .DS_Store files
    echo "Removing .DS_Store files..."
    find $path -name ".DS_Store" -exec rm {} \;

    echo

    echo "Done."
end

source ~/.config/fish/config_abbr.fish
starship init fish | source
status --is-interactive; and source (rbenv init -|psub)
