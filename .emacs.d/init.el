;; Add target directories to load path recursively
(defun add-to-load-path (&rest paths)
  (let (path)
    (dolist (path paths paths)
      (let ((default-directory
              (expand-file-name (concat user-emacs-directory path))))
        (add-to-list 'load-path default-directory)
        (if (fboundp 'normal-top-level-add-subdirs-to-load-path)
            (normal-top-level-add-subdirs-to-load-path))))))

(add-to-load-path "elisp")



;; Encode
(set-language-environment "Japanese")
(prefer-coding-system 'utf-8)

;; Encode for file system
(when (eq system-type 'darwin)
  (require 'ucs-normalize)
  (set-file-name-coding-system 'utf-8-hfs)
  (setq locale-coding-system 'utf-8-hfs))

;; Tab width
(setq-default tab-width 2)

;; Use space instead of tab
(setq-default indent-tabs-mode nil)

;; Delete trailing whitespace
(add-hook 'before-save-hook 'delete-trailing-whitespace)

;; Color Theme
(when (require 'color-theme nil t)
  (color-theme-initialize)
  (when (require 'color-theme-solarized)
    (color-theme-solarized-dark)))

;; Font
(set-face-attribute 'default nil
                    :family "Menlo"
                    :height 120)
(set-fontset-font
 nil 'japanese-jisx0208
 (font-spec :family "Hiragino Maru Gothic Pro"))
(setq face-font-rescale-alist
      '((".*Menlo.*" . 1.0)
        (".*Hiragino_Maru_Gothic_Pro.*" . 1.2)
        ("-cdac$" . 1.3)))

;; Paren
(setq show-paren-delay 0)
(show-paren-mode t)
(setq show-paren-style 'expression)
(set-face-background 'show-paren-match-face nil)
(set-face-underline-p 'show-paren-match-face "yellow")

;; Backup files
(add-to-list 'backup-directory-alist
             (cons "." "~/.emacs.d/backups"))
(setq auto-save-file-name-transforms
      `((".*" ,(expand-file-name "~/.emacs.d/backups") t)))

;; Use 'Command key' as a 'Meta key'
(setq ns-command-modifier (quote meta))
(setq ns-alternate-modifier (quote super))

;; Mac
(setq mac-pass-control-to-system nil)
(setq mac-pass-command-to-system nil)
(setq mac-pass-option-to-system nil)

;; Backspace by C-h
(keyboard-translate ?\C-h ?\C-?)

;; Change window by C-t
(define-key global-map (kbd "C-t") 'other-window)

;; From http://d.hatena.ne.jp/rubikitch/20101126/keymap
;; (makunbound 'overriding-minor-mode-map)
(define-minor-mode overriding-minor-mode
  "強制的にC-tを割り当てる"             ;説明文字列
  t                                     ;デフォルトで有効にする
  ""                                    ;モードラインに表示しない
  `((,(kbd "C-t") . other-window)))

;; Indent region
(global-set-key "\C-x\C-i" 'indent-region)

;; cua
(cua-mode t)
(setq cua-enable-cua-keys nil)



;; auto-install
(when (require 'auto-install nil t)
  (setq auto-install-directory "~/.emacs.d/elisp")
  (auto-install-update-emacswiki-package-name t)
  (auto-install-compatibility-setup))


;; package.el
(when (require 'package nil t)
  (add-to-list 'package-archives
               '("marmalade" . "http://marmalade-repo.org/packages/"))
  (add-to-list 'package-archives '("ELPA" . "http://tromey.com/elpa/"))
  (package-initialize))


;; Auto Complete
(when (require 'auto-complete-config nil t)
  (add-to-list 'ac-dictionary-directories
    "~/.emacs.d/elisp/ac-dict")
  (define-key ac-mode-map (kbd "M-TAB") 'auto-complete)
  (ac-config-default))



;; Dash
(autoload 'dash-at-point "dash-at-point"
          "Search the word at point with Dash." t nil)
(global-set-key "\C-cd" 'dash-at-point)

;; Ruby
(add-to-list 'auto-mode-alist '("Rakefile"     . ruby-mode))
(add-to-list 'auto-mode-alist '("Gemfile"      . ruby-mode))
(add-to-list 'auto-mode-alist '("Procfile"     . ruby-mode))
(add-to-list 'auto-mode-alist '("Guardfile"    . ruby-mode))
(add-to-list 'auto-mode-alist '("\\.gemspec$"  . ruby-mode))
(add-to-list 'auto-mode-alist '("\\.rake$"     . ruby-mode))
(add-to-list 'auto-mode-alist '("\\.ru$"       . ruby-mode))
(add-to-list 'auto-mode-alist '("\\.jbuilder$" . ruby-mode))
(when (require 'ruby-block nil t)
  (setq ruby-block-highlight-toggle t))
(defun ruby-mode-hooks ()
  (ruby-block-mode t))
(add-hook 'ruby-mode-hook 'ruby-mode-hooks)

;; Ruby - indent (http://willnet.in/13)
(setq ruby-deep-indent-paren-style nil)

(defadvice ruby-indent-line (after unindent-closing-paren activate)
  (let ((column (current-column))
        indent offset)
    (save-excursion
      (back-to-indentation)
      (let ((state (syntax-ppss)))
        (setq offset (- column (current-column)))
        (when (and (eq (char-after) ?\))
                   (not (zerop (car state))))
          (goto-char (cadr state))
          (setq indent (current-indentation)))))
    (when indent
      (indent-line-to indent)
      (when (> offset 0) (forward-char offset)))))

;; Haml
(setq ac-modes (append ac-modes '(haml-mode)))

;; Scss
(add-hook 'scss-mode-hook
          (lambda ()
            (setq css-indent-offset 2)
            (setq scss-compile-at-save nil)
            (add-to-list 'ac-modes 'scss-mode)
            (add-hook 'scss-mode-hook 'ac-css-mode-setup)
            ))

;; YAML
(when (require 'yaml-mode nil t)
  (add-to-list 'auto-mode-alist '("\\.yml$" . yaml-mode)))

;; JavaScript
(defun js-indent-hook ()
  (setq js-indent-level 2
        js-expr-indent-offset 0
        indent-tabs-mode nil)
  (defun my-js-indent-line ()
    (interactive)
    (let* ((parse-status (save-excursion (syntax-ppss (point-at-bol))))
           (offset (- (current-column) (current-indentation)))
           (indentation (js--proper-indentation parse-status)))
      (back-to-indentation)
      (if (looking-at "case\\s-")
          (indent-line-to (+ indentation 2))
        (js-indent-line))
      (when (> offset 0) (forward-char offset))))
  (set (make-local-variable 'indent-line-function) 'my-js-indent-line)
  )
(add-hook 'js-mode-hook 'js-indent-hook)

;; Markdown
(autoload 'markdown-mode "markdown-mode.el"
   "Major mode for editing Markdown files" t)
(setq auto-mode-alist
   (cons '("\\.md" . markdown-mode) auto-mode-alist))

;; Htmlize
(require 'htmlize)

(defun htmlize-and-browse ()
  (interactive)
  (defcustom
    htmlize-and-browse-directory-path temporary-file-directory
    "htmlize-and-browse-temporary-file-directory"
    :type 'string
    :group 'htmlize-and-browse)
  (setq htmlize-and-browse-buffer-file-name (concat "htmlize-and-browse-" (format-time-string "%Y%m%d%H%M%S" (current-time)) ".html"))
  (setq htmlize-and-browse-buffer-file-path (concat htmlize-and-browse-directory-path htmlize-and-browse-buffer-file-name))
  (with-current-buffer (htmlize-buffer)
    (write-file htmlize-and-browse-buffer-file-path)
    (set-buffer-modified-p nil)
    (kill-buffer htmlize-and-browse-buffer-file-name)
    (shell-command (concat "open " htmlize-and-browse-buffer-file-path))
  )
)

(defun htmlize-and-browse-by-safari ()
  (interactive)
  (defcustom
    htmlize-and-browse-directory-path temporary-file-directory
    "htmlize-and-browse-temporary-file-directory"
    :type 'string
    :group 'htmlize-and-browse)
  (setq htmlize-and-browse-buffer-file-name (concat "htmlize-and-browse-" (format-time-string "%Y%m%d%H%M%S" (current-time)) ".html"))
  (setq htmlize-and-browse-buffer-file-path (concat htmlize-and-browse-directory-path htmlize-and-browse-buffer-file-name))
  (with-current-buffer (htmlize-buffer)
    (write-file htmlize-and-browse-buffer-file-path)
    (set-buffer-modified-p nil)
    (kill-buffer htmlize-and-browse-buffer-file-name)
    (shell-command (concat "open -a safari " htmlize-and-browse-buffer-file-path))
  )
)
