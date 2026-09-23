# Feilsøking
KI-modeller er veldig gode til å lese kode og forklare stack-tracer når den har tilgang på koden også. 
Hos domstolene har vi git-sha med i loggene, slik at vi kan hjelpe agenten å finne den korrekte varianten av koden som kjører i produksjon.

Ta eksempelvis [denne feilmeldingen fra lovisa-web-backend som skjer omtrent 20 ganger i uken](https://logs.mgmt.domstol.no/app/discover/#/doc/9ad183b0-89c5-11f0-b11b-19e79246c557/.ds-logs-clean-lovisa-web-backend-000007?id=-ObGzKABPz7H_aDxjSsm):

```opensearch
data_stream.namespace.keyword:lovisa-web-backend AND error.stack_trace:*
```

- `kubernetes.pod_annotations.git-sha`: 20e66f0eb35e5e553fb5d05681048a58596ab3f4
- `kubernetes.pod_annotations.git-version`: 2026-09-02T12-40--20e66f0
- `error.stack_trace`: no.domstol.resource.fellesapi.LovisaClassicResourceException$LovisClassicResourceNonTransientException$LovisaClassicResourceBadRequest: Bad request getting Lovisa classic resource
- `http.response.status_code`: 500


## Oppgave: Finn ut forslag til feilsøking
Prøv denne instruksen:

> I produksjon ser vi omtrent 20 feil av typen LovisaClassicResourceBadRequest i uken. 
> Koden som kjører er git-sha 20e66f0eb35e5e553fb5d05681048a58596ab3f4. 
> http.response.status_code er 500
>
> Hvorfor feiler det? Hva kan være årsaken? Gi noen forslag til feilsøking videre.
>
> Her er stack trace:
> no.domstol.resource.fellesapi.LovisaClassicResourceException$LovisClassicResourceNonTransientException$LovisaClassicResourceBadRequest: Bad request getting Lovisa classic resource
> 	at no.domstol.resource.fellesapi.aktoerer.AktoerEndepunkterImpl.hentAktoerer(AktoerEndepunkterImpl.kt:211)
> 	at no.domstol.resource.fellesapi.aktoerer.AktoerEndepunkterImpl$hentAktoerer$1.invokeSuspend(AktoerEndepunkterImpl.kt)
> 	at kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:34)
> 	at kotlinx.coroutines.UndispatchedCoroutine.afterResume(CoroutineContext.kt:278)
> 	at kotlinx.coroutines.AbstractCoroutine.resumeWith(AbstractCoroutine.kt:101)
> 	at kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:47)
> 	at kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:100)
> 	at io.opentelemetry.javaagent.instrumentation.kotlinxcoroutines.v1_0.RunnableWrapper.lambda$stopPropagation$0(RunnableWrapper.java:16)
> 	at io.opentelemetry.javaagent.instrumentation.kotlinxcoroutines.v1_0.RunnableWrapper.lambda$stopPropagation$0(RunnableWrapper.java:16)
> 	... (truncated)
> 
> Inner stacktrace:
> java.lang.Exception: Bad request getting Lovisa classic resource
> 	at no.domstol.resource.fellesapi.LovisaClassicResourceException$LovisClassicResourceNonTransientException.<init>(LovisaClassicResourceException.kt:47)
> 	at no.domstol.resource.fellesapi.LovisaClassicResourceException$LovisClassicResourceNonTransientException$LovisaClassicResourceBadRequest.<init>(LovisaClassicResourceException.kt:67)
> 	at no.domstol.resource.fellesapi.aktoerer.AktoerEndepunkterImpl.hentAktoerer(AktoerEndepunkterImpl.kt:211)
> 	at no.domstol.resource.fellesapi.aktoerer.AktoerEndepunkterImpl$hentAktoerer$1.invokeSuspend(AktoerEndepunkterImpl.kt)
> 	at kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:34)
> 	at kotlinx.coroutines.UndispatchedCoroutine.afterResume(CoroutineContext.kt:278)
> 	at kotlinx.coroutines.AbstractCoroutine.resumeWith(AbstractCoroutine.kt:101)
> 	at kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(ContinuationImpl.kt:47)
> 	at kotlinx.coroutines.DispatchedTask.run(DispatchedTask.kt:100)
> 	at io.opentelemetry.javaagent.instrumentation.kotlinxcoroutines.v1_0.RunnableWrapper.lambda$stopPropagation$0(RunnableWrapper.java:16)
> 	at io.opentelemetry.javaagent.instrumentation.kotlinxcoroutines.v1_0.RunnableWrapper.lambda$stopPropagation$0(RunnableWrapper.java:16)
> 	at kotlinx.coroutines.internal.LimitedDispatcher$Worker.run(LimitedDispatcher.kt:124)
> 	at io.opentelemetry.javaagent.instrumentation.kotlinxcoroutines.v1_0.RunnableWrapper.lambda$stopPropagation$0(RunnableWrapper.java:16)
> 	at kotlinx.coroutines.scheduling.TaskImpl.run(Tasks.kt:89)
> 	at kotlinx.coroutines.scheduling.CoroutineScheduler.runSafely(CoroutineScheduler.kt:586)
> 	at kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.executeTask(CoroutineScheduler.kt:798)
> 	at kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.runWorker(CoroutineScheduler.kt:717)
> 	at kotlinx.coroutines.scheduling.CoroutineScheduler$Worker.run(CoroutineScheduler.kt:704)

Vi skal ikke gjøre noen feilretting nå, men vil tippe den foreslo å gruppere feilene på HTTP-path, som vil si oss 
noe om vi har problemer med kontrakten eller om det er noe feil med datakvaliteten.

Lagre til feilsøking.md:

```shell
git add --all
git commit -m "feilsøke med stack traces"
```

Neste steg er [06-utforskning.md](06-utforskning.md).
