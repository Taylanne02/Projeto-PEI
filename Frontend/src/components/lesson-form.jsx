import { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export function LessonForm({
  initialValues = {},
  submitLabel,
  onSubmit,
  onCancel,
  canPublishPaid = true,
}) {
  const [title, setTitle] = useState(initialValues.titulo || '')
  const [description, setDescription] = useState(initialValues.descricao || '')
  const [tumblrLink, setTumblrLink] = useState(initialValues.linkTumblr || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialValues.thumbnailUrl || '',
  )
  const [free, setFree] = useState(Boolean(initialValues.gratuito))
  const [price, setPrice] = useState(
    initialValues.gratuito ? '' : String(initialValues.valor || ''),
  )
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!canPublishPaid && !free) {
      setFree(true)
      setPrice('')
    }
  }, [canPublishPaid, free])

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    const numericPrice = Number(price)

    if (!title.trim()) {
      nextErrors.title = 'Informe o título da videoaula.'
    }

    if (!canPublishPaid && !free) {
      nextErrors.price =
        'Professores pendentes só podem publicar videoaulas gratuitas.'
    } else if (!free && (!price || numericPrice <= 0)) {
      nextErrors.price = 'Informe um valor maior que zero.'
    }

    setErrors(nextErrors)
    setRequestError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitting(true)

    try {
      await onSubmit({
        titulo: title.trim(),
        descricao: description.trim(),
        linkTumblr: tumblrLink.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        gratuito: free ? 'sim' : 'não',
        valor: free ? 0 : numericPrice,
      })
    } catch (error) {
      setRequestError(error.message || 'Não foi possível salvar a videoaula.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {requestError && (
        <Alert variant="destructive">
          <AlertDescription>{requestError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="lesson-title">Título</Label>
        <Input
          id="lesson-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={Boolean(errors.title)}
          placeholder="Ex.: JavaScript para iniciantes"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lesson-description">Descrição</Label>
        <Textarea
          id="lesson-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Explique o conteúdo e os objetivos da videoaula."
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lesson-tumblr">Link do Tumblr</Label>
        <Input
          id="lesson-tumblr"
          type="url"
          value={tumblrLink}
          onChange={(event) => setTumblrLink(event.target.value)}
          placeholder="https://seu-tumblr.tumblr.com/post/..."
        />
        <p className="text-sm text-slate-500">
          Link externo usado para direcionar os alunos para o conteudo da aula.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lesson-thumbnail">Thumbnail da videoaula</Label>
        <Input
          id="lesson-thumbnail"
          type="url"
          value={thumbnailUrl}
          onChange={(event) => setThumbnailUrl(event.target.value)}
          placeholder="https://exemplo.com/imagem-da-aula.jpg"
        />
        <p className="text-sm text-slate-500">
          Se ficar vazio, a tela usa uma imagem placeholder automaticamente.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border bg-slate-50 p-4">
        <div>
          <Label htmlFor="lesson-free">Videoaula gratuita</Label>
          <p className="mt-1 text-sm text-slate-500">
            Quando ativa, nenhum valor será cobrado dos alunos.
          </p>
          {!canPublishPaid && (
            <p className="mt-2 text-sm font-medium text-orange-700">
              Seu cadastro está pendente de validação. Apenas videoaulas
              gratuitas podem ser publicadas enquanto aguarda aprovação.
            </p>
          )}
        </div>
        <Switch
          id="lesson-free"
          aria-label="Videoaula gratuita"
          checked={free}
          disabled={!canPublishPaid}
          onCheckedChange={(checked) => {
            if (!canPublishPaid) {
              return
            }
            setFree(checked)
            if (checked) setPrice('')
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lesson-price">Valor por aluno</Label>
        <Input
          id="lesson-price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          disabled={free}
          aria-invalid={Boolean(errors.price)}
          placeholder="0,00"
        />
        <p className="text-sm text-slate-500">
          Cada aluno pagará este valor para acessar a videoaula.
        </p>
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price}</p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
