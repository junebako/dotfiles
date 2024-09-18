if status is-interactive
    # Commands to run in interactive sessions can go here
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

source ~/.config/fish/config_abbr.fish
starship init fish | source
status --is-interactive; and source (rbenv init -|psub)
