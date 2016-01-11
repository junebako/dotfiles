export LC_COLLATE=C
export LC_CTYPE=ja_JP.UTF-8
export LC_MESSAGES=C
export LC_MONETARY=C
export LC_NUMERIC=C
export LC_TIME=C

export GOROOT=/usr/local/opt/go/libexec
export GOPATH=$HOME/.go
export PATH=$GOROOT/bin:$GOPATH/bin:$PATH

export MAKEOPTS="-j4"

# notifier

export SYS_NOTIFIER="/usr/local/bin/terminal-notifier"
export NOTIFY_COMMAND_COMPLETE_TIMEOUT=10

# keychain

keychain --nogui --quiet ~/.ssh/id_rsa
source ~/.keychain/$HOST-sh
