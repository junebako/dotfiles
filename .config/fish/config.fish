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
    if test (count $argv) -lt 1
        echo "Usage: rmcache <path> [depth]"
        return 1
    end

    set path $argv[1]
    set depth 1  # デフォルトの深さ

    if test (count $argv) -ge 2
        set depth $argv[2]
    end

    # 指定された深さで .DS_Store ファイルを検索
    echo "Listing .DS_Store files in $path with depth $depth:"
    find $path -name ".DS_Store" -maxdepth $depth

    echo

    # 指定された深さで .DS_Store ファイルを削除
    echo "Removing .DS_Store files..."
    find $path -name ".DS_Store" -maxdepth $depth -exec rm {} \;

    echo

    echo "Done."
end

source ~/.config/fish/config_abbr.fish
starship init fish | source
status --is-interactive; and source (rbenv init -|psub)
